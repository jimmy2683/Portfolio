'use client'

import { motion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'

const projects = [
  {
    title: 'Skibbrizz',
    description: 'A social media platform with a unique "rizz points" reward system. Features include video sharing, blog writing, and an engaging rewards mechanism.',
    image: '/projects/skibbrizz.jpg',
    technologies: ['Next.js', 'Express.js', 'Go', 'PostgreSQL', 'ShadCN', 'Tailwind CSS'],
    link: 'https://skibbrizz.com',
    github: 'https://github.com/karangupta/skibbrizz',
    status: 'In Development',
    focus: 'Scalability and performance optimization',
  },
  {
    title: 'AINexus',
    description: 'An AI recommendation system that intelligently suggests the best AI tools for various tasks, featuring a modern ChatGPT-like interface.',
    image: '/projects/ainexus.jpg',
    technologies: ['React', 'TypeScript', 'AI/ML', 'Tailwind CSS'],
    link: 'https://ainexus.ai',
    github: 'https://github.com/karangupta/ainexus',
    status: 'Prototype',
    focus: 'Logo & prototype development, modern ChatGPT-like UI',
  },
  {
    title: 'Job Portal System',
    description: 'A comprehensive job listing platform with advanced features including pagination, triggers, stored procedures, and efficient transaction management.',
    image: '/projects/job-portal.jpg',
    technologies: ['Go', 'PostgreSQL', 'REST API'],
    link: 'https://job-portal.com',
    github: 'https://github.com/karangupta/job-portal',
    status: 'In Development',
    focus: 'Database optimization and transaction management',
  },
  {
    title: 'Hacko Fiesta',
    description: 'An innovative web app integrating smart parking, geospatial mapping, adaptive traffic lights, and AI-based traffic management solutions.',
    image: '/projects/hacko-fiesta.jpg',
    technologies: ['Python', 'AI/ML', 'Geospatial Mapping', 'Web Technologies'],
    link: 'https://hacko-fiesta.com',
    github: 'https://github.com/karangupta/hacko-fiesta',
    status: 'In Development',
    focus: 'Web interface & geospatial mapping',
  },
  {
    title: 'VR-VISIT',
    description: 'A blueprint-to-VR converter for architectural visualization, creating immersive VR experiences for architectural design.',
    image: '/projects/vr-visit.jpg',
    technologies: ['Three.js', 'WebGL', 'VR', '3D Modeling'],
    link: 'https://vr-visit.com',
    github: 'https://github.com/karangupta/vr-visit',
    status: 'Prototype',
    focus: 'VR experience development',
  },
  {
    title: 'DDR Simulator UI',
    description: 'A Flutter app integrating a DDR simulator UI, designed to work seamlessly with ESP32 hardware.',
    image: '/projects/ddr-simulator.jpg',
    technologies: ['Flutter', 'ESP32', 'UI/UX'],
    link: 'https://ddr-simulator.com',
    github: 'https://github.com/karangupta/ddr-simulator',
    status: 'In Development',
    focus: 'UI development',
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ongoing Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore my journey through the cosmos of code, where each project represents a new frontier in technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 