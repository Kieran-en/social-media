// Visitor.jsx
import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import { Clock, Mail, Phone, MapPin, Calendar, Users, Music, Church, ChevronRight } from 'lucide-react';
import frontViewImage from '../Images/front-view.jpeg';
import insideViewImage from '../Images/inside-view.jpeg';

function Visitor() {
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('section').forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const timelineEvents = [
        {
            year: '1988',
            title: 'Initiative de création',
            description: "L'EEC de Messa 1 prend l'initiative de créer une annexe nommée Melen/Biyem-assi pour rapprocher les fidèles et évangéliser les habitants de la zone.",
            color: 'bg-blue-500'
        },
        {
            year: 'Sept 1989',
            title: 'Naissance de l\'annexe',
            description: "L'annexe prend vie sous la recommandation du conseil d'anciens. Deux anciens, feu Tamo Jacques et feu Mbiankam, sont détachés de Messa I.",
            color: 'bg-green-500'
        },
        {
            year: '24 Sept 1989',
            title: 'Premier culte',
            description: "Pasteur GUETE Philippe conduit le premier culte avec plus de 50 fidèles. Le Pasteur KOUONGA Benjamin arrive deux mois après.",
            color: 'bg-yellow-500'
        },
        {
            year: 'Juin 1991',
            title: 'Paroisse indépendante',
            description: "L'annexe devient paroisse Melen/Biyem-assi après des campagnes d'évangélisation réussies.",
            color: 'bg-purple-500'
        },
        {
            year: 'Déc 1991',
            title: 'Premiers anciens',
            description: "Élection des premiers anciens et désignation des premiers conseillers de la nouvelle paroisse.",
            color: 'bg-orange-500'
        },
        {
            year: 'Jan 1993',
            title: 'Séparation',
            description: "Séparation de la paroisse Melen/Biyem-assi en entités distinctes.",
            color: 'bg-red-500'
        }
    ];

    const chorales = ['Canaan', 'Fils bien aimés', 'Hosanna', 'Etoile de l\'Eternel', 'Nouvelle génération', 'Splendeur divine', 'Psaumes150', 'Jéricho'];
    const mouvements = ['Culte d\'enfants', 'UCJG', 'UFC', 'Groupe d\'animation liturgique', 'Groupe de lecture biblique', 'EMMAUS', 'JEEC Melen'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            <Nav />

            <section id="home" className={`pt-32 pb-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
                isVisible.home ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 text-gray-900">
                        Bienvenue à la paroisse
                        <span className="block mt-2 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent">
                            EEC de Melen!
                        </span>
                    </h1>

                    <div className="grid md:grid-cols-2 gap-6 mb-12">
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                            <img src={frontViewImage} alt="Placeholder" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="absolute bottom-4 left-4 text-white font-semibold text-lg">Vue extérieure</p>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                            <img src={insideViewImage} alt="inside view" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <p className="absolute bottom-4 left-4 text-white font-semibold text-lg">Vue intérieure</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-500">
                        <div className="flex items-center justify-center mb-8">
                            <Clock className="h-8 w-8 text-blue-500 mr-3" />
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">Horaire des cultes</p>
                        </div>
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <li className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl p-5 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
                                <span className="text-4xl block mb-3">👶</span>
                                <div className="font-bold text-lg mb-1">7h - 8h30</div>
                                <div className="text-white/95">Culte d'enfants</div>
                            </li>
                            <li className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl p-5 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
                                <span className="text-4xl block mb-3">🌅</span>
                                <div className="font-bold text-lg mb-1">8h - 10h</div>
                                <div className="text-white/95">1er Culte d'adultes en français</div>
                            </li>
                            <li className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl p-5 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
                                <span className="text-4xl block mb-3">☀️</span>
                                <div className="font-bold text-lg mb-1">10h - 12h</div>
                                <div className="text-white/95">2ème Culte d'adultes en français</div>
                            </li>
                            <li className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl p-5 text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
                                <span className="text-4xl block mb-3">🌆</span>
                                <div className="font-bold text-lg mb-1">17h - 19h</div>
                                <div className="text-white/95">3ème Culte en français et anglais</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="about" className={`py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-blue-50 to-green-50 transition-all duration-1000 ${
                isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-gray-900">
                        À propos
                        <span className="block text-lg md:text-xl font-normal text-gray-600 mt-3">
                            Notre histoire depuis 1988
                        </span>
                    </h2>

                    <div className="mb-16">
                        <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
                            <Calendar className="h-6 w-6 text-blue-500 mr-3" />
                            Chronologie historique
                        </h3>

                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-green-500 to-yellow-500"></div>

                            {timelineEvents.map((event, index) => (
                                <div key={index} className={`relative flex items-start mb-8 transition-all duration-700 hover:translate-x-2`}
                                     style={{ animationDelay: `${index * 100}ms` }}>
                                    <div className={`absolute left-6 w-5 h-5 ${event.color} rounded-full border-4 border-white shadow-lg`}></div>
                                    <div className="ml-16 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 flex-1">
                                        <div className="flex items-center mb-2">
                                            <span className={`${event.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                                                {event.year}
                                            </span>
                                            <h4 className="ml-4 text-xl font-bold text-gray-800">{event.title}</h4>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white hover:shadow-2xl transition-all duration-300">
                            <h3 className="text-2xl font-bold mb-6 flex items-center">
                                <Music className="h-6 w-6 mr-3" />
                                Groupes Choraux
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {chorales.map((chorale, index) => (
                                    <span key={index} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                                        {chorale}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 text-white hover:shadow-2xl transition-all duration-300">
                            <h3 className="text-2xl font-bold mb-6 flex items-center">
                                <Users className="h-6 w-6 mr-3" />
                                Mouvements
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {mouvements.map((mouvement, index) => (
                                    <span key={index} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 hover:scale-105 transition-all duration-300 cursor-pointer">
                                        {mouvement}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contacts" className={`py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 transition-all duration-1000 ${
                isVisible.contacts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white">
                        Contacts
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
                            <MapPin className="h-10 w-10 text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="font-semibold text-lg mb-2 text-white">Adresse</h3>
                            <p className="text-blue-100">Marché Melen, près de la clôture de la GP</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
                            <Mail className="h-10 w-10 text-green-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="font-semibold text-lg mb-2 text-white">Email</h3>
                            <p className="text-blue-100">info@eecmelen.org</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
                            <Phone className="h-10 w-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="font-semibold text-lg mb-2 text-white">Téléphone</h3>
                            <p className="text-blue-100">+(237) 222-31-12-25</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 group">
                            <Phone className="h-10 w-10 text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="font-semibold text-lg mb-2 text-white">Fax</h3>
                            <p className="text-blue-100">+(237) 222-31-12-25</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-900 text-white py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-400">© 2024 EEC Melen. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}

export default Visitor;