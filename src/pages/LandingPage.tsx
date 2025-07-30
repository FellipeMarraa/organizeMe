"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {CheckCircle, Calendar, BookOpen, Cloud, Smartphone, Shield, Book} from "lucide-react"

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Passo a Passo",
      description: "Registre processos técnicos e operacionais de forma organizada e detalhada.",
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: "Planner Interativo",
      description: "Visualize sua rotina com calendário mensal, semanal e diário personalizável.",
    },
    {
      icon: <Cloud className="h-8 w-8 text-primary" />,
      title: "Armazenamento em Nuvem",
      description: "Seus dados seguros e acessíveis de qualquer lugar com Firebase.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Totalmente Responsivo",
      description: "Interface otimizada para desktop, tablet e smartphone.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Login Seguro",
      description: "Autenticação segura com email/senha ou conta Google.",
    },
  ]

  const benefits = [
    "Organize processos complexos em etapas simples",
    "Nunca mais esqueça compromissos importantes",
    "Acesse suas informações de qualquer dispositivo",
    "Interface intuitiva e fácil de usar",
    "Dados sempre seguros e protegidos",
  ]

  return (
    <div className="bg-gradient-to-br from-cyan-500 via-white to-cyan-200 p-2">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">I forgot my book</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-x-4">
            <Button onClick={() => navigate("/login")}>
              Entrar
            </Button>
            {/*<Button onClick={() => navigate("/login")}>Começar Agora</Button>*/}
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sua rotina
            <span className="text-primary block">sob controle</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            I forgot my book é a solução completa para organizar sua rotina pessoal ou profissional. Registre processos,
            planeje seu tempo e acesse tudo de qualquer lugar.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={() => navigate("/login")}>
              Começar Gratuitamente
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Funcionalidades Poderosas</h2>
          <p className="text-xl text-gray-600">Tudo que você precisa para organizar sua vida em um só lugar</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Por que escolher o I forgot my book?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary to-blue-300 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Comece hoje mesmo!</h3>
                <p className="text-lg mb-6 opacity-90">
                  Junte-se a milhares de usuários que já organizaram suas vidas com o I forgot my book.
                </p>
                <Button size="lg" variant="secondary" onClick={() => navigate("/login")} className="w-full">
                  Criar Conta Gratuita
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Pronto para organizar sua vida?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comece agora mesmo e descubra como é fácil manter tudo sob controle.
          </p>
          <Button size="lg" onClick={() => navigate("/login")}>
            Começar Gratuitamente
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 bottom-0">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold">I forgot my book</span>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <p className="text-gray-400">Feito pra você que esqueceu o caderno</p>
            <Book className="h-5 w-5 text-gray-400" />
          </div>
          {/*<p className="text-gray-400 bottom-0">© 2025 I forgot my book</p>*/}
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
