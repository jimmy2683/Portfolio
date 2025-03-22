'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const projects = [
  {
    title: 'VR-VISIT 🚀',
    description: 'Blueprint-to-VR converter',
    tech: ['Three.js', 'React', 'WebGL']
  },
  {
    title: 'Skibbrizz 🎥',
    description: 'Next.js social media app with rizz points',
    tech: ['Next.js', 'Tailwind CSS', 'PostgreSQL']
  },
  {
    title: 'AINexus 🤖',
    description: 'AI-powered tool recommendation system',
    tech: ['Python', 'TensorFlow', 'React']
  },
  {
    title: 'Smart Traffic App 🚦',
    description: 'Real-time traffic & smart parking system',
    tech: ['Go', 'PostgreSQL', 'WebSocket']
  },
  {
    title: 'Job Portal System 💼',
    description: 'Scalable backend for job listings',
    tech: ['Go', 'PostgreSQL', 'REST API']
  }
]

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  return (
    <section id="projects" className="min-h-screen py-20 px-6">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center text-white mb-12"
      >
        Projects
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedProject(index)}
          >
            <div className="relative p-6 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-colors">
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-white/70 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedProject !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/90 p-8 rounded-xl max-w-2xl w-full mx-4">
            <h3 className="text-3xl font-bold text-white mb-4">
              {projects[selectedProject].title}
            </h3>
            <p className="text-white/70 mb-6">
              {projects[selectedProject].description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {projects[selectedProject].tech.map((tech, i) => (
                <span key={i} className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400 text-sm">
                  {tech}
                </span>
              ))}
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="px-4 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  )
} 