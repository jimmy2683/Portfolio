'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const socials = [
  { name: 'GitHub', url: 'https://github.com/jimmy2683', icon: '🐙' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/karan-gupta-b27119283/', icon: '💼' },
  { name: 'Leetcode', url: 'https://leetcode.com/u/karangupta0805/', icon: '🐦' },
  { name: 'Codeforces', url: 'https://codeforces.com/profile/jimmy2683', icon: '🐦' }
]

export function Contact() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formData)
    setIsFormVisible(false)
  }

  return (
    <section id="contact" className="min-h-screen py-20 px-6">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center text-white mb-12"
      >
        Get in Touch
      </motion.h2>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {socials.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 transition-colors text-center"
            >
              <span className="text-2xl mb-2 block">{social.icon}</span>
              <span className="text-white/70">{social.name}</span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative"
        >
          <button
            onClick={() => setIsFormVisible(true)}
            className="w-full py-4 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 hover:bg-cyan-400/20 transition-colors"
          >
            Open Contact Form
          </button>

          {isFormVisible && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-black/90 p-8 rounded-xl max-w-md w-full mx-4"
              >
                <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/70 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400/50 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400/50 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 mb-2">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white focus:border-cyan-400/50 outline-none h-32"
                      required
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-cyan-400/10 text-cyan-400 rounded-lg hover:bg-cyan-400/20 transition-colors"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFormVisible(false)}
                      className="flex-1 py-2 bg-white/5 text-white/70 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
} 