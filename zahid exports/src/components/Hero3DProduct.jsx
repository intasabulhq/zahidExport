import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'

function makeMaterial(color, metalness = 0, roughness = 0.45) {
  return new MeshStandardMaterial({ color, metalness, roughness })
}

function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale) {
  const mesh = new Mesh(geometry, material)
  mesh.position.set(...position)
  mesh.rotation.set(...rotation)
  if (scale) mesh.scale.set(...scale)
  parent.add(mesh)
  return mesh
}

function addCylinderBetween(parent, start, end, radius, material) {
  const from = new Vector3(...start)
  const to = new Vector3(...end)
  const direction = new Vector3().subVectors(to, from)
  const mesh = new Mesh(new CylinderGeometry(radius, radius, direction.length(), 12), material)
  mesh.position.copy(from).add(to).multiplyScalar(0.5)
  mesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction.normalize())
  parent.add(mesh)
  return mesh
}

function createClock() {
  const group = new Group()
  const brass = makeMaterial('#a77b49', 0.78, 0.28)
  const darkBrass = makeMaterial('#60452c', 0.72, 0.35)
  const dial = makeMaterial('#e8dfcf', 0.08, 0.62)
  const ink = makeMaterial('#302923', 0.18, 0.38)

  addMesh(group, new CylinderGeometry(1.12, 1.12, 0.15, 72), darkBrass, [0, 0, -0.04], [Math.PI / 2, 0, 0])
  addMesh(group, new CircleGeometry(1.055, 72), dial, [0, 0, 0.045])
  addMesh(group, new TorusGeometry(1.12, 0.055, 14, 88), brass, [0, 0, 0.13])
  addMesh(group, new TorusGeometry(1.025, 0.012, 8, 72), darkBrass, [0, 0, 0.14])

  const tickGeometry = new BoxGeometry(0.025, 0.105, 0.018)
  const hourTickGeometry = new BoxGeometry(0.05, 0.15, 0.025)
  for (let index = 0; index < 60; index += 1) {
    const angle = (index / 60) * Math.PI * 2
    const isHour = index % 5 === 0
    const radius = 0.91
    addMesh(
      group,
      isHour ? hourTickGeometry : tickGeometry,
      isHour ? darkBrass : brass,
      [Math.sin(angle) * radius, Math.cos(angle) * radius, 0.17],
      [0, 0, -angle],
    )
  }

  addMesh(group, new BoxGeometry(0.075, 0.55, 0.035), ink, [0, 0.18, 0.2], [0, 0, -0.24])
  addMesh(group, new BoxGeometry(0.045, 0.78, 0.026), darkBrass, [0.04, 0.32, 0.22], [0, 0, 0.53])
  addMesh(group, new SphereGeometry(0.075, 20, 16), brass, [0, 0, 0.245])
  addMesh(group, new BoxGeometry(0.08, 0.24, 0.025), ink, [0, -0.08, 0.21], [0, 0, Math.PI])
  return group
}

function createPlanter() {
  const group = new Group()
  const bronze = makeMaterial('#96704a', 0.7, 0.34)
  const bronzeLight = makeMaterial('#bd9565', 0.78, 0.3)
  const soil = makeMaterial('#30261e', 0.02, 1)
  const stem = makeMaterial('#39583b', 0.02, 0.72)
  const greens = [makeMaterial('#486c46', 0.02, 0.64), makeMaterial('#66845a', 0.02, 0.62), makeMaterial('#314f38', 0.02, 0.7)]

  addMesh(group, new CylinderGeometry(0.68, 0.49, 0.84, 48, 1, false), bronze, [0, 0.36, 0])
  addMesh(group, new CylinderGeometry(0.66, 0.66, 0.045, 48), soil, [0, 0.8, 0])
  addMesh(group, new TorusGeometry(0.67, 0.045, 12, 64), bronzeLight, [0, 0.79, 0], [Math.PI / 2, 0, 0])
  addMesh(group, new TorusGeometry(0.57, 0.018, 8, 56), bronzeLight, [0, 0.02, 0], [Math.PI / 2, 0, 0])

  // A simple open metal stand with three curved-looking angled legs and a lower ring.
  addMesh(group, new TorusGeometry(0.59, 0.035, 10, 64), bronzeLight, [0, -0.1, 0], [Math.PI / 2, 0, 0])
  for (let leg = 0; leg < 3; leg += 1) {
    const angle = (leg / 3) * Math.PI * 2 + Math.PI / 6
    const upper = [Math.cos(angle) * 0.48, -0.03, Math.sin(angle) * 0.48]
    const lower = [Math.cos(angle) * 0.77, -1.05, Math.sin(angle) * 0.77]
    addCylinderBetween(group, upper, lower, 0.045, bronze)
    addMesh(group, new CylinderGeometry(0.07, 0.085, 0.12, 16), bronzeLight, [lower[0], -1.08, lower[2]])
  }

  const plantRoot = [0, 0.82, 0]
  const leafGeometry = new SphereGeometry(1, 16, 12)
  for (let leaf = 0; leaf < 9; leaf += 1) {
    const angle = (leaf / 9) * Math.PI * 2
    const height = 0.5 + (leaf % 3) * 0.12
    const reach = 0.42 + (leaf % 2) * 0.1
    const tip = [Math.cos(angle) * reach, plantRoot[1] + height, Math.sin(angle) * reach]
    addCylinderBetween(group, plantRoot, tip, 0.018, stem)
    const direction = new Vector3(...tip).sub(new Vector3(...plantRoot)).normalize()
    const leafMesh = addMesh(group, leafGeometry, greens[leaf % greens.length], tip, [0, 0, 0], [0.12, 0.39, 0.055])
    leafMesh.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction)
  }
  return group
}

function createTray() {
  const group = new Group()
  const walnut = makeMaterial('#795235', 0.14, 0.48)
  const walnutLight = makeMaterial('#a5794f', 0.1, 0.5)
  const brass = makeMaterial('#b48b58', 0.78, 0.28)

  addMesh(group, new BoxGeometry(2.05, 0.12, 1.28), walnut, [0, 0, 0])
  addMesh(group, new BoxGeometry(1.94, 0.025, 1.15), walnutLight, [0, 0.073, 0])
  addMesh(group, new BoxGeometry(2.12, 0.14, 0.09), walnut, [0, 0.12, 0.59])
  addMesh(group, new BoxGeometry(2.12, 0.14, 0.09), walnut, [0, 0.12, -0.59])
  addMesh(group, new BoxGeometry(0.09, 0.14, 1.12), walnut, [1.015, 0.12, 0])
  addMesh(group, new BoxGeometry(0.09, 0.14, 1.12), walnut, [-1.015, 0.12, 0])
  addMesh(group, new BoxGeometry(1.96, 0.024, 0.018), brass, [0, 0.202, 0.52])
  addMesh(group, new BoxGeometry(1.96, 0.024, 0.018), brass, [0, 0.202, -0.52])
  addMesh(group, new BoxGeometry(0.018, 0.024, 1.0), brass, [0.94, 0.202, 0])
  addMesh(group, new BoxGeometry(0.018, 0.024, 1.0), brass, [-0.94, 0.202, 0])

  for (const side of [-1, 1]) {
    addMesh(group, new TorusGeometry(0.16, 0.026, 10, 28), brass, [side * 1.12, 0.17, 0], [0, Math.PI / 2, 0])
    addMesh(group, new CylinderGeometry(0.035, 0.035, 0.13, 16), brass, [side * 1.045, 0.16, 0.14])
    addMesh(group, new CylinderGeometry(0.035, 0.035, 0.13, 16), brass, [side * 1.045, 0.16, -0.14])
  }
  return group
}

function createProduct(kind) {
  if (kind === 'clock') return createClock()
  if (kind === 'tray') return createTray()
  return createPlanter()
}

function Hero3DProduct({ kind, fallback, alt }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let renderer
    let frame = 0
    let resizeObserver
    const scene = new Scene()
    const product = createProduct(kind)
    scene.add(product)

    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))
      renderer.outputColorSpace = SRGBColorSpace
      renderer.toneMapping = ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.12
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.className = 'hero-product-canvas'
      renderer.domElement.setAttribute('aria-hidden', 'true')
      host.appendChild(renderer.domElement)
      host.dataset.ready = 'true'

      scene.add(new AmbientLight('#fff4e4', 2.2))
      const keyLight = new DirectionalLight('#fff0d7', 3.4)
      keyLight.position.set(-3, 4, 5)
      scene.add(keyLight)
      const rimLight = new DirectionalLight('#d4e3ff', 2.1)
      rimLight.position.set(3, 1, -3)
      scene.add(rimLight)

      const camera = new PerspectiveCamera(32, 1, 0.1, 40)
      if (kind === 'clock') camera.position.set(0, 0, 5.4)
      else if (kind === 'tray') camera.position.set(0, 2.65, 4.6)
      else camera.position.set(0, 0.25, 5.6)
      camera.lookAt(0, kind === 'tray' ? 0.05 : 0.15, 0)

      function resize() {
        const width = host.clientWidth || 360
        const height = host.clientHeight || 360
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      }
      resize()
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(host)

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reducedMotion) {
        renderer.render(scene, camera)
      } else {
        function animate(time) {
          const seconds = time * 0.001
          product.position.y = Math.sin(seconds * 1.15) * 0.055
          product.rotation.y = Math.sin(seconds * 0.42) * 0.16
          product.rotation.x = kind === 'tray' ? -0.16 + Math.sin(seconds * 0.35) * 0.035 : Math.sin(seconds * 0.3) * 0.035
          renderer.render(scene, camera)
          frame = window.requestAnimationFrame(animate)
        }
        frame = window.requestAnimationFrame(animate)
      }
    } catch (error) {
      console.warn('3D hero unavailable; displaying the product image fallback.', error)
      host.dataset.ready = 'false'
    }

    return () => {
      window.cancelAnimationFrame(frame)
      resizeObserver?.disconnect()
      scene.traverse((object) => {
        if (!object.isMesh) return
        object.geometry.dispose()
        if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose())
        else object.material.dispose()
      })
      renderer?.dispose()
      renderer?.domElement.remove()
      delete host.dataset.ready
    }
  }, [kind])

  return (
    <div ref={hostRef} className="hero-product-model" aria-label={alt}>
      <img className="hero-product-image" src={fallback} alt={alt} />
    </div>
  )
}

export default Hero3DProduct
