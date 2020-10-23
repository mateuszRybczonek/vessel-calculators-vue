<template>
  <div ref="container" class="scene"></div>
</template>

<script>
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import ThreeOrbitControls from 'three-orbit-controls'

const OrbitControls = ThreeOrbitControls(THREE)
const textureLoader = new THREE.TextureLoader()
const objLoader = new OBJLoader()

textureLoader.crossOrigin = ''

const kArraysColors = [
  '#FF0000',
  '#35B04C'
]

const kWaterGeometry = new THREE.PlaneGeometry(70, 70, 32)
let waterMaterial = null
let waterSurface = null

const kSeabedGeometry = new THREE.PlaneGeometry(100, 100, 32)
let seabedMaterial = null
let seabed = null

let vesselObject = null

export default {
  name: 'ThreeDimensionalView',

  props: {
    arrays: {
      type: Array,
      required: true
    },

    beaconsRadius: {
      type: Number,
      required: true
    },

    pan: {
      type: String,
      default: ''
    },

    controllable: {
      type: Boolean,
      default: false
    },

    distanceWhTransponder: {
      type: Number,
      required: true
    },

    relativeDepth: {
      type: Number,
      required: true
    },

    wellhead: {
      type: Object,
      required: true
    },

    cameraPosition: {
      type: Array,
      default: () => [2, 25, 3]
    },

    cameraFov: {
      type: Number,
      default: 30
    },

    showWaterSurface: {
      type: Boolean,
      default: true
    },

    showVessel: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      camera: null,
      scale: 20
    }
  },

  computed: {
    scene () {
      return new THREE.Scene()
    },

    renderer () {
      return new THREE.WebGLRenderer({ antialias: true })
    },

    metersPerScaleUnit () {
      return this.relativeDepth / this.scale
    },

    wellheadObject () {
      return new THREE.Mesh(
        new THREE.CylinderGeometry(
          20 / this.metersPerScaleUnit,
          20 / this.metersPerScaleUnit,
          50 / this.metersPerScaleUnit,
          32
        ),
        new THREE.MeshPhongMaterial({ color: '#696969' })
      )
    }
  },

  mounted () {
    const container = this.$refs.container
    this.scene.background = new THREE.Color()

    this.setRendered(container)

    // Axes helper
    // this.scene.add(new THREE.AxesHelper(100))

    this.setLights()

    if (this.showWaterSurface) {
      this.addWaterSurface()
    }

    this.addSeabed()

    if (this.showVessel) {
      this.addVessel()
    }

    this.addWellhead()

    // Add wellhead <-> transponder distance circle
    this.addCircle(this.distanceWhTransponder / this.metersPerScaleUnit, '#696969')

    // Add vessel WH line
    this.addLine('#696969', [[0, this.scale, 0], [0, 0, 0]])

    this.addBeacons()
    this.setCamera(container)
    this.render()
  },

  methods: {
    animate () {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },

    addLine (color, points) {
      const material = new THREE.LineBasicMaterial({ color })
      const vectorPoints = []

      points.forEach((point) => {
        vectorPoints.push(new THREE.Vector3(...point))
      })

      const geometry = new THREE.BufferGeometry().setFromPoints(vectorPoints)
      const line = new THREE.Line(geometry, material)
      this.scene.add(line)
    },

    addCircle (radius, color, position = [0, 1 / this.metersPerScaleUnit, 0]) {
      const circle = new THREE.Mesh(
        new THREE.CircleGeometry(radius, 32),
        new THREE.MeshBasicMaterial({
          color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.2
        })
      )

      circle.rotation.set(-1.5708, 0, 0)
      circle.position.set(...position)
      this.scene.add(circle)
    },

    addBeacon (beacon, color) {
      const { easting: WHEasting, northing: WHNorting } = this.wellhead
      const relativeEasting = WHEasting - beacon.easting
      const relativeNorthing = WHNorting - beacon.northing

      // Add beacon object
      const material = new THREE.MeshPhongMaterial({ color })
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          10 / this.metersPerScaleUnit,
          10 / this.metersPerScaleUnit,
          30 / this.metersPerScaleUnit,
          32
        ),
        material
      )

      mesh.position.set(
        relativeEasting / this.metersPerScaleUnit,
        15 / this.metersPerScaleUnit,
        relativeNorthing / this.metersPerScaleUnit
      )

      this.scene.add(mesh)

      // Add beacon radius
      this.addCircle(
        this.beaconsRadius / this.metersPerScaleUnit,
        color,
        [
          relativeEasting / this.metersPerScaleUnit,
          4 / this.metersPerScaleUnit,
          relativeNorthing / this.metersPerScaleUnit
        ]
      )
    },

    addBeacons () {
      const { easting: WHEasting, northing: WHNorting } = this.wellhead

      this.arrays.forEach((array, index) => {
        array.beacons.forEach((beacon) => {
          const relativeEasting = WHEasting - beacon.easting
          const relativeNorthing = WHNorting - beacon.northing

          this.addBeacon(beacon, kArraysColors[index])

          this.addLine(kArraysColors[index], [
            [0, this.scale, 0],
            [relativeEasting / this.metersPerScaleUnit, 0, relativeNorthing / this.metersPerScaleUnit]
          ])
        })
      })
    },

    async addWaterSurface () {
      await this.setWaterMaterial()

      waterSurface = new THREE.Mesh(kWaterGeometry, waterMaterial)
      waterSurface.position.set(0, this.scale, 0)
      waterSurface.rotation.set(-1.5708, 0, 0)

      this.scene.add(waterSurface)
      this.renderer.render(this.scene, this.camera)
    },

    async setWaterMaterial () {
      if (waterMaterial) {
        return
      }

      waterMaterial = new THREE.MeshBasicMaterial()
      waterMaterial.map = await textureLoader.load('https://mr-textures.s3.eu-north-1.amazonaws.com/Water.jpg')
      waterMaterial.opacity = 0.2
      waterMaterial.side = THREE.DoubleSide
      waterMaterial.transparent = true
    },

    async addSeabed () {
      await this.setSeabedMaterial()

      seabed = new THREE.Mesh(kSeabedGeometry, seabedMaterial)
      seabed.position.set(0, 0, 0)
      seabed.rotation.set(-1.5708, 0, 0)

      this.scene.add(seabed)
      this.renderer.render(this.scene, this.camera)
    },

    async setSeabedMaterial () {
      if (seabedMaterial) {
        return
      }

      seabedMaterial = new THREE.MeshBasicMaterial()
      const texture = await textureLoader.load('https://mr-textures.s3.eu-north-1.amazonaws.com/seabed.jpg')
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(20, 20)

      seabedMaterial.map = texture
      seabedMaterial.opacity = 0.5
      seabedMaterial.side = THREE.DoubleSide
      seabedMaterial.transparent = true
    },

    async addVessel () {
      await this.setVesselObject()
      this.scene.add(vesselObject)
    },

    async loadVessel () {
      return new Promise((resolve) => {
        objLoader.load(
          'https://mr-textures.s3.eu-north-1.amazonaws.com/stripped-textured.obj',
          (object) => {
            resolve(object)
          }
        )
      })
    },

    async setVesselObject () {
      if (vesselObject) {
        return
      }

      vesselObject = await this.loadVessel()
      vesselObject.scale.set(0.1, 0.1, 0.1)
      vesselObject.position.set(0, this.scale, 0)
    },

    addWellhead () {
      this.wellheadObject.position.set(0, 25 / this.metersPerScaleUnit, 0)
      this.scene.add(this.wellheadObject)
    },

    setLights () {
      this.scene.add(new THREE.AmbientLight('#ffeecc'))

      const directionalLight = new THREE.DirectionalLight('#ffeecc', 0.5)
      directionalLight.position.set(0, 1, 2)
      this.scene.add(directionalLight)
    },

    setRendered (container) {
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(this.renderer.domElement)
    },

    setCamera (container) {
      this.camera = new THREE.PerspectiveCamera(
        this.cameraFov,
        container.clientWidth / container.clientHeight,
        1,
        1000
      )

      const cameraControls = new OrbitControls(this.camera, this.renderer.domElement)
      cameraControls.maxDistance = 30
      cameraControls.minDistance = 3
      cameraControls.zoomSpeed = 0.3

      if (this.pan === 'horizontal') {
        cameraControls.maxPolarAngle = 0
        cameraControls.minPolarAngle = 0
      } else if (this.pan === 'vertical') {
        cameraControls.maxPolarAngle = 2.31
        cameraControls.minPolarAngle = 2.31
      }

      cameraControls.target = new THREE.Vector3(0, 20, 0)
      this.camera.position.set(...this.cameraPosition)
      cameraControls.update()
    },

    render () {
      this.renderer.render(this.scene, this.camera)

      if (this.controllable) {
        this.animate()
      }
    }
  }
}
</script>

<style scoped>
.scene {
  width: 100%;
  height: 600px;
}
</style>
