'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectCardProps {
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  github?: string
  status: string
  focus: string
}

export function ProjectCard({
  title,
  description,
  image,
  technologies,
  link,
  github,
  status,
  focus,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === 'In Development' 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
          }`}>
            {status}
          </span>
        </div>
        
        <p className="text-gray-300 mb-4">{description}</p>

        {/* Focus Area */}
        <div className="mb-4">
          <p className="text-sm text-cyan-400 mb-1">Focus:</p>
          <p className="text-sm text-gray-400">{focus}</p>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-500/30 hover:border-cyan-500/50 transition-all"
          >
            Live Demo
          </Link>
          {github && (
            <Link
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:border-white/30 transition-all"
            >
              GitHub
            </Link>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
    </motion.div>
  )
} 