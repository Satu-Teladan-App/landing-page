"use client"

import HeroSection from "@/modules/Hero"
import { TextGradientScroll } from "@/components/TextGradient"
import { Timeline } from "@/components/Timeline"
import { StaggerTestimonials } from "@/components/StaggerTestimonial"
import { motion } from "framer-motion"
import SmoothScrollHero from "@/components/SmoothScroll"
import Footer from "@/modules/Footer"

export default function Page() {
  const missionStatement =
    "Satu Teladan hadir sebagai jembatan digital yang menghubungkan seluruh keluarga besar SMA Negeri 1 Yogyakarta. Dari alumni lintas generasi hingga siswa aktif, dari guru hingga orang tua—semuanya terhubung dalam satu platform. Bagikan pengalaman, temukan mentor, akses informasi terkini, dan jadilah bagian dari komunitas Teladan yang terus bertumbuh. Bersama, kita membangun jaringan yang kuat untuk masa depan yang lebih cerah."

  const timelineEntries = [
    {
      id: 1,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/SMA_Negeri_1_Yogyakarta%2C_2024.jpg/1280px-SMA_Negeri_1_Yogyakarta%2C_2024.jpg",
      alt: "Fitur Koneksi Alumni",
      title: "Terhubung dengan Alumni",
      description:
        "Temukan dan terhubung dengan ribuan alumni Teladan dari berbagai angkatan. Bangun networking profesional, temukan mentor di bidang yang Anda minati, atau sekadar bernostalgia dengan teman lama.",
      layout: "left" as const,
    },
    {
      id: 2,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/SMA_Negeri_1_Yogyakarta%2C_2024.jpg/1280px-SMA_Negeri_1_Yogyakarta%2C_2024.jpg",
      alt: "Fitur Berita dan Event",
      title: "Informasi Terkini",
      description:
        "Dapatkan update terbaru seputar kegiatan sekolah, reuni, acara alumni, dan berbagai informasi penting lainnya. Tidak akan ketinggalan momen berharga bersama keluarga besar Teladan.",
      layout: "right" as const,
    },
    {
      id: 3,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/SMA_Negeri_1_Yogyakarta%2C_2024.jpg/1280px-SMA_Negeri_1_Yogyakarta%2C_2024.jpg",
      alt: "Fitur Direktori dan Profil",
      title: "Direktori Lengkap",
      description:
        "Akses direktori lengkap alumni berdasarkan angkatan, profesi, lokasi, dan bidang keahlian. Cari koneksi yang tepat untuk kolaborasi bisnis, karir, atau pengembangan diri.",
      layout: "left" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Mission Statement Section with Grid Background */}
      <section id="tentang" className="relative min-h-screen flex items-center justify-center py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-12 text-gray-900">TENTANG APLIKASI</h2>
            <TextGradientScroll
              text={missionStatement}
              className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-gray-800"
              type="word"
              textOpacity="soft"
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="fitur" className="relative py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <div className="container mx-auto px-6 mb-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-gray-900">FITUR UNGGULAN</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Dirancang khusus untuk memudahkan keluarga besar Teladan tetap terhubung.
              </p>
            </div>
          </div>

          <Timeline entries={timelineEntries} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimoni" className="relative py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-wider text-gray-900 mb-6">
              Kata Mereka Tentang{" "}
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">APLIKASI</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Cerita nyata dari pengguna yang telah merasakan manfaat aplikasi Satu Teladan.
            </p>
          </motion.div>

          <StaggerTestimonials />
        </div>
      </section>

      {/* Smooth Scroll Hero with CTA Overlay */}
      <section id="download" className="relative">
        <SmoothScrollHero
          scrollHeight={2500}
          desktopImage="/images/satuteladan.jpg"
          mobileImage="/images/satuteladan.jpg"
          initialClipPercentage={30}
          finalClipPercentage={70}
        />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
