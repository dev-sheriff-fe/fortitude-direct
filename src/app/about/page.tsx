import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Shield, Users, Award, Target, Handshake, ShoppingCart, CreditCard, Zap, Globe, BarChart3 } from "lucide-react";
// import FadeIn from "@/components/animations/fade-in";
import About from "@/components/images/about-fortitude.jpg"; // You'll need to add an appropriate image
import About2 from "@/components/images/about2-fortitude.jpg";
import Header from "../../../fortitude-app/layout/header";
import Footer from "../../../fortitude-app/layout/footer";
import { Suspense } from "react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
    <Suspense>
    <Header />


      {/* Hero Section */}
      <section className="text-accent-foreground bg-gray-100 py-10 px-5">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Fortitude Direct
            </h1>
            <p className="text-xl">
              Revolutionizing ecommerce with innovative shopping experiences and seamless payment solutions
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="container mx-auto py-12 px-5 py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* <FadeIn direction="left"> */}
                <div className="">
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Fortitude Direct was founded with a vision to transform the ecommerce landscape in Africa and beyond. 
                    We recognized the need for a comprehensive digital marketplace that not only offers a wide range of products 
                    but also integrates financial services and innovative payment solutions.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed mt-4">
                    Our platform brings together the best of online shopping, financial services, and digital solutions 
                    in one seamless experience. From everyday goods to flight tickets, from crypto payments to buy now, 
                    pay later options - we're building the future of commerce today.
                  </p>
                </div>
              {/* </FadeIn> */}
            </div>
            {/* <FadeIn direction="right"> */}
              <div className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={About}
                  alt="Fortitude Direct Ecommerce Platform"
                  fill
                  className="object-cover"
                />
              </div>
            {/* </FadeIn> */}
          </div>
        </div>
      </section>


      {/* Mission & Vision */}
      <section className="px-5 py-20 bg-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-accent mr-3" />
                <h2 className="text-3xl font-bold">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600">
                To become Africa's leading digital marketplace that seamlessly integrates ecommerce, 
                financial services, and innovative payment solutions for everyone.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
              <div className="flex items-center mb-4">
                <Zap className="h-8 w-8 text-accent mr-3" />
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600">
                To empower businesses and consumers with a comprehensive platform that simplifies online shopping, 
                financial transactions, and digital service access through cutting-edge technology and user-friendly experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-5 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Fortitude Direct provides a comprehensive ecosystem designed to meet all your shopping and financial needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingCart className="h-10 w-10 text-accent" />,
                title: "Digital Marketplace",
                description: "A vast selection of products across categories with seamless shopping experience and fast delivery options."
              },
              {
                icon: <CreditCard className="h-10 w-10 text-accent" />,
                title: "Financial Services",
                description: "Airtime top-ups, bill payments, money transfers, and withdrawals all in one convenient platform."
              },
              {
                icon: <Globe className="h-10 w-10 text-accent" />,
                title: "Digital Services",
                description: "Flight tickets, event bookings, and other digital services accessible from anywhere at any time."
              },
              {
                icon: <BarChart3 className="h-10 w-10 text-accent" />,
                title: "Crypto Payments",
                description: "Secure cryptocurrency payment options for modern shoppers who prefer digital currency transactions."
              },
              {
                icon: <Handshake className="h-10 w-10 text-accent" />,
                title: "BNPL Solutions",
                description: "Flexible buy now, pay later options that make shopping more accessible and budget-friendly."
              },
              {
                icon: <Users className="h-10 w-10 text-accent" />,
                title: "Dual Dashboards",
                description: "Customized interfaces for both customers and store owners with analytics, inventory management, and sales tracking."
              }
            ].map((feature, index) => (
            //   <FadeIn key={index} direction="up" delay={index * 0.1}>
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 h-full">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
            //   </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-5 py-20 bg-gray-100">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Fortitude Direct
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8 text-accent" />,
                title: "Customer First",
                description: "We prioritize our customers' needs and continuously innovate to enhance their shopping and payment experience."
              },
              {
                icon: <Shield className="h-8 w-8 text-accent" />,
                title: "Security & Trust",
                description: "We implement robust security measures to protect our users' data and transactions, building trust through transparency."
              },
              {
                icon: <Award className="h-8 w-8 text-accent" />,
                title: "Innovation",
                description: "We embrace cutting-edge technology to deliver forward-thinking solutions that anticipate market needs."
              },
              {
                icon: <Handshake className="h-8 w-8 text-accent" />,
                title: "Accessibility",
                description: "We believe in making ecommerce and financial services accessible to everyone, regardless of their technical expertise."
              }
            ].map((value, index) => (
            //   <FadeIn key={index} direction="up" delay={index * 0.1}>
                <div className="flex bg-accent-foreground rounded-2xl shadow-md p-6 border border-accent hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex-shrink-0 mt-1">{value.icon}</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold mb-2 text-white">{value.title}</h3>
                    <p className="text-gray-600 text-white">{value.description}</p>
                  </div>
                </div>
            //   </FadeIn>
            ))}
          </div>
        </div>
      </section>
      

      {/* Technology Section */}
      <section className="px-5 py-20 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* <FadeIn direction="left"> */}
              <div className="relative h-[250px] md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={About2} // Replace with actual tech image
                  alt="Fortitude Direct Technology"
                  fill
                  className="object-cover"
                />
              </div>
            {/* </FadeIn> */}

            {/* <FadeIn direction="right"> */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">Our Technology</h2>
                <p className="text-lg text-gray-600">
                  Fortitude Direct is built on a robust, scalable technology stack that ensures:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Lightning-fast page loads and seamless navigation</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Bank-level security for all transactions</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Intuitive dashboards for both customers and store owners</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Seamless integration of crypto and BNPL payment options</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-accent mt-1">•</div>
                    <p className="ml-2 text-gray-600">Mobile-first design for shopping on any device</p>
                  </li>
                </ul>
              </div>
            {/* </FadeIn> */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-5 container rounded-3xl mx-auto bg-accent text-white mb-50">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Fortitude Direct Community</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Experience the future of ecommerce with innovative features, secure payments, and exceptional service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-white text-accent hover:bg-accent-foreground hover:text-white border-white border-1">
                Start Shopping
              </Button>
            </Link>
            <Link href="/admin-login" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-accent-foreground border-white border-1 text-white hover:bg-white hover:text-accent">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      </Suspense>
    </>
  );
}