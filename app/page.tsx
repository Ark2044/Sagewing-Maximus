"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Zap, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const expertCategories = [
  {
    title: "Professional Chill Guy",
    id: "chill-guy",
    icon: MessageSquare,
    description: "Elevate your meme game to intergalactic levels.",
    color: "from-pink-500/80 to-rose-500/80",
    image: "/chillguy.jpg",
    fullDescription:
      "Unleash the power of AI-generated memes that will make the internet laugh, cry, and everything in between. From viral content to inside jokes, we've got you covered.",
    skills: ["Meme Creation", "Viral Content", "Internet Humor"],
    benefits: [
      "Instant Meme Generation",
      "Trending Content Analysis",
      "Humor Optimization",
    ],
  },
  {
    title: "Dynamic UI/UX",
    id: "ux",
    icon: Zap,
    description: "Creating buttons so good, they deserve their own fan club.",
    color: "from-purple-500/80 to-violet-600/80",
    image: "/uxtech.jpg",
    fullDescription:
      "Design interactive, pixel-perfect buttons that not only look amazing but also provide an unparalleled user experience. We turn clicks into art.",
    skills: ["UX Design", "Interaction Design", "Micro-interactions"],
    benefits: [
      "Pixel-Perfect Design",
      "Interactive Prototyping",
      "User Experience Optimization",
    ],
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">
            Sagewing Maximus
            </span>
          </div>
          <div className="space-x-4">
            <Link
              href="#categories"
              className="hover:text-purple-600 transition"
            >
              Categories
            </Link>
            <Link
              href="/demo"
              className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition"
            >
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500 to-purple-700 text-white py-32 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-extrabold mb-6">
            Meet Your AI Companion
          </h1>
          <p className="text-lg mb-8">
            Revolutionize your creative and professional workflows with the
            power of AI.
          </p>
          <Link
            href="#categories"
            className="bg-white text-purple-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* Expert Categories Section */}
      <section id="categories" className="py-24 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Choose Your AI Companion
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {expertCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.03 }}
                  className="relative group"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {/* Container with Image Background */}
                  <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
                    {/* Background Image */}
                    <Image
                      src={category.image}
                      alt={category.title}
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0 z-0 opacity-90 group-hover:opacity-90 transition-opacity duration-300"
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={`
                        absolute inset-0 z-10 
                        bg-gradient-to-br
                        flex flex-col justify-end p-6 text-white cursor-pointer
                        transition-all duration-300 ease-in-out
                      `}
                    >
                      <div className="relative z-20">
                        <div className="flex items-center space-x-3 mb-4">
                          <h3 className="text-xl font-semibold">
                            {category.title}
                          </h3>
                        </div>
                        <p className="text-sm mb-4">{category.description}</p>

                        {/* Skills Tags */}
                        <div className="space-y-2 mb-4">
                          {category.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-white/20 rounded-full px-3 py-1 text-xs inline-block mr-2"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Expanded Description */}
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 text-sm"
                          >
                            <p>{category.fullDescription}</p>
                            <h4 className="font-semibold mt-2">Benefits:</h4>
                            <ul className="list-disc list-inside">
                              {category.benefits.map((benefit, index) => (
                                <li key={index} className="text-gray-100">
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                            <Link
                              href={`/${category.id}`}
                              className="mt-4 text-sm underline hover:text-gray-200 flex items-center"
                            >
                              Explore More{" "}
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                1. Select Your Expert
              </h3>
              <p className="text-gray-600">
                Browse through our AI companions and choose the one that fits
                your needs.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">2. Try the Demo</h3>
              <p className="text-gray-600">
                Experience the capabilities of your selected AI companion with
                interactive demos.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                3. Unlock Potential
              </h3>
              <p className="text-gray-600">
                Seamlessly integrate the AI features into your projects and
                workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/20 rounded-xl">
              <p className="italic mb-4">
                "This AI Companion has completely transformed the way I work on
                creative projects. The meme generator is my favorite!"
              </p>
              <h4 className="font-bold">— Alex Johnson</h4>
            </div>
            <div className="p-6 bg-white/20 rounded-xl">
              <p className="italic mb-4">
                "The UI/UX tools are incredible. My designs are now more
                interactive and user-friendly than ever before."
              </p>
              <h4 className="font-bold">— Jamie Lee</h4>
            </div>
            <div className="p-6 bg-white/20 rounded-xl">
              <p className="italic mb-4">
                "AI Companion made my workflow seamless and saved me hours of
                effort. Highly recommend it!"
              </p>
              <h4 className="font-bold">— Morgan Smith</h4>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">FAQs</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">
                Is the demo free to use?
              </h3>
              <p className="text-gray-600">
                Yes, you can try the demo for free to explore the capabilities
                of our AI companions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                How do I integrate an AI companion into my project?
              </h3>
              <p className="text-gray-600">
                After selecting your AI companion, follow the provided
                integration guides for a seamless setup.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Can I use AI Companion for commercial purposes?
              </h3>
              <p className="text-gray-600">
                Absolutely! Our AI solutions are designed for both personal and
                commercial use.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
