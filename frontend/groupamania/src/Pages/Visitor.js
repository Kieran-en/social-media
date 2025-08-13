import React from 'react'
import Nav from './Nav'
import styles from '../Styles/visitor.module.css' // optional for styling
import frontViewImage from '../Images/front-view.jpeg' // optional for placeholder image
import insideViewImage from '../Images/inside-view.jpeg'

function Visitor() {
  return (
    <div className={styles.Pagecontainer}>
      <Nav />

      {/* Home Section */}
      <section id="home" className={styles.section}>
        <h1>Bienvenue à la paroisse EEC de Melen!</h1>
        <div className={styles.imgView}>
            <img src={frontViewImage} alt="Placeholder" className={styles.placeholderImage} />
            <img src={insideViewImage} alt="inside view" className={styles.placeholderImage} />
        </div>
        <div>
            <p><b>Horaire des cultes</b></p>
            <ul>
                <li>Culte d'enfants : 7h - 8h30</li>
                <li>1er Culte d'adultes en français : 8h - 10h.</li>
                <li>2ème Culte d'adultes en français : 10h - 12h.</li>
                <li>3ème Culte en français et anglais : 17h - 19h.</li>
            </ul>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.section}>
        <h2>À propos</h2>
        <p>
          Dans le souci de rapprocher les fidèles de Messa 1 vivant dans la zone de Melen / Biyem-assi, d'évangéliser les habitants des zones de 
          Melen et ses environs, en 1988, l'EEC de Messa 1 a pris l'initiative de créer une annexe nommée Melen/biyem-assi. Elle prendra vie en
          septembre 1989, sous la recommandation et l'investigation des paroissiens et du conseil d'anciens de Messa 1. 
        </p>
        <p>
            A la suite de cette initiative, deux anciens feu Tamo Jacques et feu Mbiankam ont été détachés de la paroisse de Messa I pour 
            l'encadrement des fidèles.
        </p>
        <p>
            Le premier culte conduit par Pasteur GUETE Philippe eu lieu le 24 septembre 1989. Il a été une merveille de Dieu avec plus de 50 fidèles. Deux
            mois après, le Pasteur KOUONGA Benjamin arrive et à travers des campagnes d'évangélisations, l'effectif augmente. En juin 1991 l'annexe 
            devient paroisse Melen / Biyem-assi
        </p>
        <p>
            En décembre 1991, ont lieu l’élection des premiers anciens et la désignation des premiers conseillers. 
        </p>
        <p>
            En Janvier 1993, il y a eu séparation de la paroisse Melen / Biyem-assi. 
        </p>
        <p>
            Au cours de cette évolution, les groupes choraux (Canaan, Fils bien aimés, Hosanna, Etoile de l'Eternel , Nouvelle génération, Splendeur divine, 
            Psaumes150, Jéricho ) et mouvements (Culte d'enfants, UCJG, UFC, Groupe d'animation liturgique, Groupe de lecture de la bible de genèse à
            apocalypse en un an , EMMAUS, JEEC melen,) ont vu le jour pour la cohésion fraternelle et l'œuvre de notre Seigneur Jésus au sein de la 
            paroisse de Melen
        </p>
      </section>

      {/* Contacts Section */}
      <section id="contacts" className={styles.section}>
        <h2>Contacts</h2>
        <p>Adresse: Marché Melen, près de la clôture de la GP</p>
        <p>Email: info@eecmelen.org</p>
        <p>Telephone: +(237) 222-31-12-25</p>
        <p>Fax: +(237) 222-31-12-25</p>
      </section>
    </div>
  )
}

export default Visitor
