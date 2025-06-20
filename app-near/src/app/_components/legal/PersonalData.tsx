import Link from "next/link";

const PersonalData: React.FC = () => {
  return (
    <div>
      <h1 id="personal-data" className="pb-6 text-center text-black">
        Protection des données personnelles
      </h1>

      <p>
        Sur cette page, prenez connaissance de la collecte, de l’analyse et du
        traitement de vos données personnelles par l’ABC. Apprenez également à
        mieux gérer vos données personnelles.
      </p>

      <p className="pt-3 font-bold">Sommaire</p>
      <ul className="list-inside list-disc pt-2">
        <li>ARTICLE 1. DONNÉES PERSONNELLES QUE NOUS RECUEILLONS</li>
        <li>ARTICLE 2. DONNÉES RELATIVES A LA CONSULTATION DU SITE</li>
        <li>2.1 En cas d’utilisation partagée de votre terminal</li>
        <li>2.2 Cookies Tiers</li>
        <li>2.3 Comment exprimer vos choix concernant les cookies ?</li>
        <li>2.3.1 Vos choix exprimés directement via votre terminal</li>
        <li>
          2.3.2 Vos choix exprimés en ligne auprès de plateformes
          interprofessionnelles
        </li>
        <li>ARTICLE 3. RÉSEAUX SOCIAUX</li>
      </ul>

      <h2 className="pb-2 pt-3 font-bold">
        ARTICLE 1. DONNÉES PERSONNELLES QUE NOUS RECUEILLONS
      </h2>
      <p className="pt-2">
        Vous pouvez être invités sur le Site à fournir des données personnelles
        qui vous concernent ou qui sont relatives à un tiers. Cette collecte de
        données s’effectue notamment :
      </p>
      <ul>
        <li>lorsque vous naviguez sur le Site,</li>
        <li>
          lorsque vous partagez une page avec un ami par envoi d’un e-mail,
        </li>
        <li>
          lorsque vous partagez une page ou une offre par l’intermédiaire d’un
          réseau social.
        </li>
      </ul>

      <p className="pt-2">
        Les données collectées sont destinées à l’usage de l’Association pour la
        transition Bas Carbone et du Réseau des Quartiers en Transition, afin de
        gérer la relation commerciale avec vous et vous tenir informés des
        actualités. En vous inscrivant vous pouvez également être informés des
        actualités de l’Association pour la transition Bas Carbone et du Réseau
        des Quartiers en Transition, sous forme de newsletters, emails
        événementiels. Si vous ne souhaitez plus recevoir ces propositions, vous
        pouvez nous en informer à tout moment par courrier ou par e-mail
        (coordonnées indiquées dans la rubrique « Contact » du Site) ou via le
        lien de désabonnement contenu dans chacun des emails que nous vous
        envoyons.
      </p>

      <p>
        L’Association pour la transition Bas Carbone et le Réseau des Quartiers
        en Transition, sont responsables du traitement de vos données. Elles
        peuvent être transmises aux sociétés et sous-traitants et à ses
        prestataires, situés dans et hors de l’Union européenne, auxquels
        l’Association pour la transition Bas Carbone et le Réseau des Quartiers
        en Transition, font appel.
      </p>

      <p>
        Les traitements de données personnelles mis en œuvre par l’Association
        pour la transition Bas Carbone et le Réseau des Quartiers en Transition,
        via le Site ont fait l’objet des registres et notifications prévus par
        la loi française « Informatique & Libertés » no 78-17 du 6 janvier 1978,
        notamment auprès de la CNIL (
        <Link target="_blank" className="font-normal" href="www.cnil.fr">
          www.cnil.fr
        </Link>
        ). Conformément à cette loi, vous disposez d’un droit d’accès, de
        modification, de rectification et de suppression portant sur les données
        personnelles vous concernant, que vous pouvez exercer en écrivant à ”
        l’Association pour la transition Bas Carbone – 39 rue du Caire – 75002
        Paris – France “.
      </p>

      <p>
        Dans le cas d’une demande d’accès à vos données personnelles, une copie
        de votre pièce d’identité recto/verso est nécessaire.
      </p>

      <h2 className="pb-2 pt-3 font-bold">
        ARTICLE 2. DONNEES RELATIVES A LA CONSULTATION DU SITE
      </h2>
      <p>
        Certaines informations non personnelles peuvent être recueillies à
        l’occasion de votre navigation sur le Site, comme la version de votre
        navigateur (Chrome, Firefox, Safari, Opéra, Internet Explorer, etc.), le
        type de système d’exploitation utilisé (Linux, Windows 98, Mac Os, etc.)
        et l’adresse IP (Internet Protocol) de l’ordinateur utilisé.
        L’Association pour la transition Bas Carbone et le Réseau des Quartiers
        en Transition utilisent des cookies, destinés à stocker des informations
        pouvant identifier votre terminal (ordinateur, tablette, smartphone,
        etc.) durant la consultation du Site afin de faciliter l’expérience de
        navigation sur ce dernier.
      </p>
      <p>
        En outre, l’Association pour la transition Bas Carbone et le Réseau des
        Quartiers en Transition sont susceptibles d’acheter des espaces
        publicitaires directement ou par l’intermédiaire de prestataires
        (agences de conseil en communication) afin de promouvoir ses activités
        et ses offres sur des sites ou applications de tiers, au moyen de
        contenus publicitaires (texte, graphismes, animations, vidéos, etc.)
        diffusés par ces sites ou applications. De même, des cookies sont
        susceptibles d’être inclus dans les espaces publicitaires du Site.
      </p>
      <p>
        Lors de l’affichage de tels contenus publicitaires, des informations
        relatives à la navigation de votre terminal (ordinateur, tablette,
        smartphone, etc.) sont susceptibles d’être enregistrées dans des
        fichiers « cookies » installés sur ce terminal, sous réserve des choix
        exprimés concernant les cookies, par l’un des moyens décrit à l’Article
        2.5 ci-dessous et que vous pouvez modifier à tout moment. Seul
        l’émetteur d’un cookie est susceptible de lire ou de modifier des
        informations qui y sont contenues.
      </p>
      <p>
        Les cookies que l’Association pour la transition Bas Carbone et le
        Réseau des Quartiers en Transition émettent permettent :
      </p>
      <ul>
        <li>
          {">"} d’établir des statistiques et volumes de fréquentation et
          d’utilisation des divers éléments composant le Site (rubriques et
          contenus visités, parcours), et nous permettent d’améliorer l’intérêt
          et l’ergonomie des services consultés sur le Site,
        </li>
        <li>
          {">"} d’adapter la présentation du Site et des espaces publicitaires y
          afférent aux préférences d’affichage de votre terminal (langue
          utilisée, résolution d’affichage, système d’exploitation utilisé, etc)
          lors des visites sur le Site, selon les matériels et les logiciels de
          visualisation ou de lecture que ce terminal comporte,
        </li>
        <li>
          {">"} de mémoriser des informations relatives à un formulaire que vous
          auriez rempli sur le Site (inscription ou accès au compte) ou à
          d’éventuels services ou informations que vous avez choisis sur le
          Site,
        </li>
        <li>
          {">"} de vous permettre d’accéder à des espaces réservés et personnels
          du Site, grâce aux identifiants choisis lors de l’inscription au Site,
        </li>
        <li>
          {">"} de mettre en œuvre des mesures de sécurité, par exemple
          lorsqu’un accès réservé est révoqué après un certain laps de temps.
        </li>
      </ul>
      <p>
        Si vous refusez l’enregistrement de cookies sur votre terminal, ou en
        cas de suppression de ceux qui y sont enregistrés, vous ne pourrez plus
        bénéficier d’un certain nombre de fonctionnalités qui sont néanmoins
        nécessaires pour naviguer dans certains espaces du Site. Le cas échéant,
        l’Association pour la transition Bas Carbone et le Réseau des Quartiers
        en Transition déclinent toute responsabilité pour les conséquences liées
        au fonctionnement dégradé des services du Site résultant de
        l’impossibilité d’enregistrer ou de consulter les cookies nécessaires à
        leur fonctionnement et que vous auriez refusés ou supprimés.
      </p>

      <h3 className="pb-1 pt-3 italic">
        2.1 En cas d’utilisation partagée de votre terminal
      </h3>
      <p>
        Si votre terminal est utilisé par plusieurs personnes et lorsqu’un même
        terminal dispose de plusieurs logiciels de navigation, l’Association
        pour la transition Bas Carbone et le Réseau des Quartiers en Transition
        ne sauraient s’assurer de manière certaine que les services et
        publicités destinés à ce terminal correspondent bien à votre utilisation
        propre et non à celle d’un autre utilisateur de ce terminal. Le cas
        échéant, le partage avec d’autres personnes de l’utilisation de ce
        terminal et la configuration des paramètres du navigateur utilisé à
        l’égard des cookies, relèvent de votre libre choix et de votre
        responsabilité.
      </p>

      <h3 className="pb-1 pt-3 italic">2.2 Cookies tiers</h3>
      <p>
        Lorsque vous naviguez sur le Site, des cookies émis par des sociétés
        tierces peuvent être placés par ces dernières sur votre terminal, sous
        réserve des choix que vous avez pu exercer antérieurement ou à tout
        moment, notamment au travers de la configuration des paramètres de votre
        logiciel de navigation, dans les conditions décrites à l’Article 2.3
        ci-dessous. Ces cookies ont pour finalité d’identifier les contenus
        consultés sur le Site et de collecter des données de navigation afin de
        personnaliser l’offre publicitaire qui pourrait vous être présentée en
        dehors du Site. Les données recueillies par le biais de ces cookies sont
        partagées avec des tiers à des fins publicitaires.
      </p>
      <p>
        Dans le cadre de ce type de partenariat publicitaire, l’Association pour
        la transition Bas Carbone et le Réseau des Quartiers en Transition
        peuvent donc être amenés à transmettre au partenaire concerné des
        données de navigation anonymes concernant les contenus consultés avec
        votre terminal lors de votre navigation sur le Site.
      </p>
      <p>
        L’émission et l’utilisation de cookies par des tiers sont soumises aux
        politiques de protection de la vie privée de ces tiers. L’Association
        pour la transition Bas Carbone et le Réseau des Quartiers en Transition
        vous informe de l’objet des cookies dont l’Association pour la
        transition Bas Carbone et le Réseau des Quartiers en Transition ont
        connaissance et des moyens dont vous disposez pour effectuer des choix à
        l’égard de ces cookies et de leurs émetteurs respectifs.
      </p>

      <h3 className="pb-1 pt-3 italic">
        2.3 Comment exprimer vos choix concernant les cookies ?
      </h3>
      <h4 className="pb-1 italic">
        2.3.1 Vos choix exprimés directement via votre terminal
      </h4>
      <p>
        Vous pouvez également autoriser ou refuser l’enregistrement de cookies
        dans votre terminal (mais dans ce dernier cas, il est possible que
        certaines fonctionnalités du site s’en trouvent affectées), en
        configurant votre navigateur à cette fin.
      </p>
      <p>
        Attention, la configuration de chaque navigateur est différente. Elle
        est décrite dans le menu d’aide de votre navigateur, qui vous permettra
        de savoir de quelle manière modifier vos souhaits en matière de cookies,
        notamment de la manière suivante pour les navigateurs les plus
        couramment utilisés :
      </p>
      <ul>
        <li>
          <strong>Pour Internet Explorer™ :</strong>{" "}
          <Link
            target="_blank"
            className="font-normal"
            href="https://windows.microsoft.com/fr-FR/windows-vista/Block-or-allow-cookies"
          >
            https://windows.microsoft.com/fr-FR/windows-vista/Block-or-allow-cookies
          </Link>
        </li>
        <li>
          <strong>Pour Safari™ :</strong>{" "}
          <Link
            target="_blank"
            className="font-normal"
            href="https://www.apple.com/fr/privacy/use-of-cookies/"
          >
            https://www.apple.com/fr/privacy/use-of-cookies/
          </Link>
        </li>
        <li>
          <strong>Pour Chrome™ :</strong>{" "}
          <Link
            target="_blank"
            className="font-normal"
            href="https://support.google.com/chrome/bin/answer.py?hl=fr&hlrm=en&answer=95647"
          >
            https://support.google.com/chrome/bin/answer.py?hl=fr&hlrm=en&answer=95647
          </Link>
        </li>
        <li>
          <strong>Pour Firefox™ : </strong>{" "}
          <Link
            target="_blank"
            className="font-normal"
            href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent#w_parametres-des-cookies"
          >
            https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent#w_parametres-des-cookies
          </Link>
        </li>
        <li>
          <strong>Pour Opéra™ : </strong>{" "}
          <Link
            target="_blank"
            className="font-normal"
            href="https://help.opera.com/Windows/10.20/fr/cookies.html"
          >
            https://help.opera.com/Windows/10.20/fr/cookies.html
          </Link>
        </li>
      </ul>

      <h4 className="pb-1 pt-3 italic">
        2.3.2 Vos choix exprimés en ligne auprès de plateformes
        interprofessionnelles
      </h4>
      <p>
        Vous pouvez vous connecter au site Youronlinechoices, proposé par les
        professionnels de la publicité digitale regroupés au sein de
        l’association européenne EDAA (European Digital Advertising Alliance) et
        géré en France par l’Interactive Advertising Bureau (IAB) France.
      </p>
      <p>
        Vous pourrez ainsi connaître les entreprises inscrites à cette
        plate-forme et qui vous offrent la possibilité d’accepter ou de refuser
        les cookies utilisés par ces entreprises pour adapter aux informations
        de navigation qu’elles traitent les publicités susceptibles d’être
        affichées lors de la consultation par votre terminal de services en
        ligne sur lesquels elles émettent des cookies :&nbsp;
        <Link
          target="_blank"
          className="font-normal"
          href="https://www.youronlinechoices.com/fr/controler-ses-cookies/"
        >
          https://www.youronlinechoices.com/fr/controler-ses-cookies/
        </Link>
        .
      </p>
      <p>
        Cette plate-forme européenne est partagée par des centaines de
        professionnels de la publicité sur Internet et constitue une interface
        centralisée vous permettant d’exprimer vos choix des cookies
        susceptibles d’être utilisés afin d’adapter à la navigation de votre
        terminal les publicités susceptibles d’être affichées lors de la visite
        d’un service en ligne.
      </p>
      <p>
        Notez que cette procédure n’empêchera pas l’affichage de publicités sur
        les sites Internet que vous visitez. Elle ne bloquera que les
        technologies qui permettent d’adapter des publicités à la navigation de
        votre terminal et à vos centres d’intérêts.
      </p>

      <h2 className="pb-2 pt-3 font-bold">ARTICLE 3. RÉSEAUX SOCIAUX</h2>
      <p>
        Si vous interagissez au moyen des plug-ins, par exemple en cliquant sur
        le bouton « J’aime » ou « Partager », les informations liées à votre
        navigation sur le Site et à votre adhésion à ces réseaux seront
        transmises et enregistrées sur un serveur de la société exploitant le
        Réseau Social considéré et partagées selon les paramètres de votre
        compte d’utilisateur de ces Réseaux Sociaux, conformément aux conditions
        d’utilisation du Réseau Social considéré.
      </p>
      <p>
        Si vous ne souhaitez pas qu’un Réseau Social relie les informations
        collectées par l’intermédiaire du Site au compte utilisateur du Réseau
        Social considéré, vous devez vous déconnecter du Réseau Social considéré
        avant de visiter le Site.
      </p>
      <p>
        En tout état de cause, l’utilisation de ces plug-in ou boutons est
        opérée par ces Réseaux Sociaux et est exclusivement régie par les
        conditions vous liant au Réseau Social dont vous êtes membre.
      </p>

      <h3 className="pb-1 pt-3 italic">
        Politique de confidentialité des fonctionnalités du Site
      </h3>

      <h3 className="pb-1 pt-3 italic">Commentaires</h3>
      <p>
        Quand vous laissez un commentaire sur notre site web, les données
        inscrites dans le formulaire de commentaire, mais aussi votre adresse IP
        et l’agent utilisateur de votre navigateur sont collectés pour nous
        aider à la détection des commentaires indésirables.
      </p>

      <h3 className="pb-1 pt-3 italic">Newsletter</h3>
      <p className="pt-2">
        Nous considérons également que les utilisateurs qui ont ouvert et/ou
        cliqué sur nos newsletters dans les 4 dernières années consentissent à
        recevoir nos mailings. Nous mettons en avant un Opt-out sur tous nos
        envois permettant à l’utilisateur de se désabonner très facilement et
        rapidement.
      </p>

      <h3 className="pb-1 pt-3 italic">Informations supplémentaires</h3>

      <h3 className="pb-1 pt-3 italic">Comment nous protégeons vos données</h3>
      <p>
        Pour encore plus protéger vos données, nous avons comme objectif de
        mettre en place un système d’anonymisation des adresses IP de nos
        visiteurs.
      </p>

      <h3 className="pb-1 pt-3 italic">
        Procédures mises en œuvre en cas de fuite de données
      </h3>
      <p>
        En cas d’anomalie constatée (fuite involontaire ou volontaire), nous
        nous engageons dans les 3 jours maximum, à communiquer en toute
        transparence sur la fuite. La loi nous oblige également à informer
        l’autorité de contrôle compétente, la CNIL en France.
      </p>
      <p>
        Nous avertirons très rapidement les personnes dont les données ont été
        piratées, si la fuite peut engendrer un risque réel pour leurs droits et
        libertés (données sensibles).
      </p>
    </div>
  );
};

export default PersonalData;
