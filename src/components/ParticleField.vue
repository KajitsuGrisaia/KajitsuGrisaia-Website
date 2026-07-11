<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const canvas = ref(null)
let renderer
let scene
let camera
let particles
let animationFrame

function resize() {
  if (!renderer || !camera) return

  const width = window.innerWidth
  const height = window.innerHeight

  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

onMounted(() => {
  if (props.disabled || !canvas.value) return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  )
  camera.position.z = 7

  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    alpha: true,
    antialias: true,
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7))
  renderer.setSize(window.innerWidth, window.innerHeight, false)

  const geometry = new THREE.BufferGeometry()
  const particleCount = 130
  const positions = new Float32Array(particleCount * 3)

  for (let index = 0; index < particleCount; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * 12
    positions[index * 3 + 1] = (Math.random() - 0.5) * 8
    positions[index * 3 + 2] = (Math.random() - 0.5) * 5
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  particles = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.035,
      transparent: true,
      opacity: 0.42,
    }),
  )

  scene.add(particles)
  window.addEventListener('resize', resize)

  function render() {
    particles.rotation.y += 0.0009
    particles.rotation.x += 0.00035
    renderer.render(scene, camera)
    animationFrame = requestAnimationFrame(render)
  }

  render()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)

  if (animationFrame) cancelAnimationFrame(animationFrame)

  particles?.geometry.dispose()
  particles?.material.dispose()
  renderer?.dispose()
})
</script>

<template>
  <canvas ref="canvas" class="particle-canvas" aria-hidden="true" />
</template>
