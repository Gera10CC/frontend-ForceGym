import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaFacebookF, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contacto" className="py-16 md:py-24 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-yellow-400">CONTÁCTANOS</span>
          </h2>
          <div className="w-24 h-1 bg-yellow-400 mx-auto"></div>
        </div>

        {/* Contenido */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Información de contacto */}
          <div className="space-y-8">
            <p className="text-lg md:text-xl leading-relaxed">
              ¡Estamos aquí para ayudarte! Contáctanos por cualquier duda o consulta sobre nuestros servicios.
            </p>

            <div className="space-y-6">
              {/* Elementos de contacto */}
              <div className="flex items-start">
                <div className="text-yellow-400 mr-4 mt-1">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Correo electrónico</h3>
                  <a 
                    href="mailto:forcegymfullfitness@gmail.com" 
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    forcegymfullfitness@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-yellow-400 mr-4 mt-1">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Dirección</h3>
                  <a
                    href="https://www.google.com/maps/place/83CP%2B452,+Heredia,+La+Victoria/@10.3202,-83.9144,17z/data=!4m5!3m4!1s0x8fa0bd9a713f6e0d:0xa206b90f4a24b947!8m2!3d10.3202625!4d-83.9146094?hl=es&entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    83CP+452, Heredia, La Victoria
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="text-yellow-400 mr-4 mt-1">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                  <a
                    href="tel:+50688437359"
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    +506 8843 7359
                  </a>
                </div>
              </div>

              {/* Redes sociales */}
              <div className="pt-4">
                <h3 className="font-semibold text-lg mb-4">Síguenos</h3>
                <div className="flex space-x-6">
                  <a
                    href="https://www.facebook.com/profile.php?id=100083292401041"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black p-3 rounded-full hover:bg-yellow-400 transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="text-lg" />
                  </a>
                  <a
                    href="https://www.instagram.com/forcegym_fullfitness?igsh=aWR3bTVxbXhvOGln"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-black p-3 rounded-full hover:bg-yellow-400 transition-colors"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-lg" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div className="h-full">
            <div className="bg-white p-1 rounded-lg shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.4323445760934!2d-83.9146094!3d10.3202625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0bd9a713f6e0d%3A0xa206b90f4a24b947!2s83CP%2B452%2C%20Heredia%2C%20La%20Victoria!5e0!3m2!1ses!2scr!4v1682588905686!5m2!1ses!2scr"
                width="100%"
                height="400"
                className="border-0 rounded-lg"
                allowFullScreen
                loading="lazy"
                aria-label="Mapa de ubicación de Force Gym"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;