import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const App = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 8;

    // Sparkling wave particles
    const numParticles = 15000;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const golden = new THREE.Color(0xffd700);

    for (let i = 0; i < numParticles; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = Math.sin(x * 0.3) * 2 + (Math.random() - 0.5) * 1.5;
      const z = (Math.random() - 0.5) * 8;

      positions.set([x, y, z], i * 3);

      const color = golden.clone();
      color.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2); // subtle variation
      colors.set([color.r, color.g, color.b], i * 3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Glow light
    const pointLight = new THREE.PointLight(0xffd700, 2, 100);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);

    // Animation
    const animate = (time) => {
      requestAnimationFrame(animate);
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < numParticles; i++) {
        pos[i * 3 + 1] += Math.sin(time * 0.001 + i) * 0.0005;
      }
      geometry.attributes.position.needsUpdate = true;

      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.00015;

      renderer.render(scene, camera);
    };
    animate(0);

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="bg-black text-gray-300 min-h-screen">
      {/* 3D Golden Sparkling Background */}
      <div
        ref={mountRef}
        className="fixed top-0 left-0 w-full h-full z-0 opacity-70"
      ></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black bg-opacity-50 backdrop-blur-md shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
                SMC
              </h1>
              <span className="ml-3 text-lg font-medium text-gray-300">
                Shri Mahalaxmi Chains
              </span>
            </div>
            <nav className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a
                    href="#catalogue"
                    className="hover:text-yellow-400 transition-colors duration-300"
                  >
                    Catalogue
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-yellow-400 transition-colors duration-300"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="h-[500px] flex items-center justify-center text-center px-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl">
              Adorn Yourself in Timeless Beauty
            </h1>
            <p className="mt-4 text-xl md:text-2xl font-light max-w-2xl mx-auto text-gray-200">
              Where imitation becomes an art form. Each piece is a testament to
              meticulous craftsmanship and exquisite design.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
