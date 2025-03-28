import Link from "next/link";

const LegalNotes: React.FC = () => {
  return (
    <div>
      <h1 className="pb-4 text-center text-black">Mentions Légales</h1>
      <p>
        Conformément aux dispositions des articles 6-III et 19 de la loi pour la
        Confiance dans l’Économie Numérique, nous vous informons que ce site est
        édité par :
      </p>
      <ul>
        <li className="pt-3">
          <ul>
            <li className="pb-2 font-bold">
              Association pour la transition Bas Carbone
            </li>
            <li>Association loi 1901 à but non lucratif</li>
            <li>
              Bureaux : Climate House – 39 rue du Caire - 75002 Paris – France
            </li>
            <li>Téléphone : 09 81 10 27 93</li>
            <li>
              <Link href="mailto:contact@associationbilancarbone.fr">
                contact@associationbilancarbone.fr
              </Link>
            </li>
          </ul>
        </li>
        <li className="pt-3">
          <ul>
            <li className="pb-2 font-bold">
              Réseau des Quartiers en Transitions
            </li>
            <li>Association loi 1901 à but non lucratif</li>
            <li>
              Adresse de contact : 11, rue Pierre-Jean de Béranger 93100
              Montreuil – France
            </li>
            <li>Téléphone : 06 30 98 80 97</li>
            <li>
              <Link href="mailto:contact@quartiers-en-transitions.fr ">
                contact@quartiers-en-transitions.fr
              </Link>
            </li>
          </ul>
        </li>
      </ul>

      <h2 className="pb-2 pt-3 font-bold">Présentation du site</h2>
      <p>
        En vertu de l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la
        confiance dans l’économie numérique, il est précisé aux utilisateurs du
        site internet{" "}
        <Link href="https://projetnear.org">https://projetnear.org</Link>{" "}
        l’identité des différents intervenants dans le cadre de sa réalisation
        et de son suivi.
      </p>
      <p className="pt-2">
        <u>Propriétaire :</u> le présent site est la propriété de l’Association
        pour la transition Bas Carbone et du Réseau des Quartiers en Transition.
        Il a été créé avec le soutien de la Ville de Paris.
      </p>
      <p>
        Le contenu éditorial, textes, images composant le site web sont la
        propriété de l’Association pour la transition Bas Carbone et du Réseau
        des Quartiers en Transition. Toute représentation totale ou partielle de
        ce site, par quelques procédés que ce soient, sans autorisation
        préalable de l’Association pour la transition Bas Carbone et du Réseau
        des Quartiers en Transition, est interdite et constituerait une
        contrefaçon sanctionnée par les articles L335-2 et suivants du Code de
        la propriété intellectuelle.
      </p>
      <p>
        Tous les noms de produits ou de sociétés mentionnés dans le site web
        sont les marques de leurs titulaires.
      </p>
      <p className="pt-2">
        <u>Responsables de publication :</u> Quentin Brache et Thomas Marcus
      </p>
      <p className="pt-2">
        <u>Utilisateur :</u> internaute qui navigue, lit, visionne et utilise le
        site <Link href="https://projetnear.org/">https://projetnear.org/</Link>{" "}
        et ses services.
      </p>

      <h2 className="pb-2 pt-3 font-bold">Développement Web</h2>
      <p>
        Graphisme, développement et intégration :{" "}
        <Link href="https://pathtech.coop/">Pathtech</Link>
      </p>

      <h2 className="pb-2 pt-3 font-bold">Hébergeur</h2>
      <p>
        <Link href="https://scalingo.com/fr">Scalingo</Link>
      </p>

      <h2 className="pb-2 pt-3 font-bold">
        Acceptation des conditions Générales d’Utilisation du site et des
        services proposés
      </h2>
      <p>
        L’utilisation du site{" "}
        <Link href="https://projetnear.org">https://projetnear.org</Link>{" "}
        implique l’acceptation pleine et entière des conditions générales
        d’utilisation ci-après décrites. Ces conditions d’utilisation sont
        susceptibles d’être modifiées ou complétées à tout moment, les
        utilisateurs du site{" "}
        <Link href="https://projetnear.org">https://projetnear.org</Link> sont
        donc invités à les consulter de manière régulière.
      </p>
      <p className="pt-2">
        L’utilisateur reconnaît avoir pris connaissance des présentes CGU et
        déclare les accepter sans restriction ni réserve.
      </p>

      <h2 className="pb-2 pt-3 font-bold">Description des services fournis</h2>
      <p>
        Le site{" "}
        <Link href="https://projetnear.org">https://projetnear.org</Link> a pour
        objet de fournir une information concernant l’ensemble des éléments liés
        au projet NEAR.
      </p>
      <p className="pt-2">
        L&apos;Association pour la transition Bas Carbone et le Réseau des
        Quartiers en Transition s’efforcent de fournir sur le site{" "}
        <Link href="https://projetnear.org">https://projetnear.org</Link>
        des informations aussi précises que possible. Toutefois, ils ne pourront
        pas être tenue responsable des omissions, des inexactitudes des carences
        dans la mise à jour ou de tout autres manquements qu’ils soient de son
        fait ou du fait des tiers partenaires qui lui fournissent ces
        informations.
      </p>
      <p className="pt-2">
        Toutes les informations indiquées sur le site{" "}
        <Link href="https://projetnear.org">https://projetnear.org</Link> ont un
        caractère purement informatif, ne sont données qu’à titre indicatif et
        sont susceptibles d’évoluer. Par ailleurs, les renseignements figurant
        sur le site{" "}
        <Link href="https://projetnear.org">https://projetnear.org</Link> ne
        sont pas exhaustifs. Ils sont donnés sous réserve de modifications ayant
        été apportées depuis leur mise en ligne
      </p>

      <h2 className="pb-2 pt-3 font-bold">Disponibilité du site</h2>
      <p>
        L&apos;Association pour la transition Bas Carbone et le Réseau des
        Quartiers en Transition ne peuvent garantir une disponibilité du site
        et/ou des services, une fiabilité des transmissions et des performances
        en termes de temps de réponse ou de qualité. Il n’est prévu aucune
        assistance technique vis-à-vis de l’utilisateur que ce soit par des
        moyens électronique ou téléphonique.
      </p>
      <p className="pt-2">
        Les responsabilités de l’Association pour la transition Bas Carbone et
        du Réseau des Quartiers en Transition ne sauraient être engagées en cas
        d’impossibilité d’accès à ce site et/ou d’utilisation des services.
      </p>
      <p className="pt-2">
        L&apos;Association pour la transition Bas Carbone et le Réseau des
        Quartiers en Transition peuvent être amenées à interrompre le site ou
        une partie des services, à tout moment sans préavis, le tout sans droit
        à indemnités. L’utilisateur reconnaît et accepte que l&apos;Association
        pour la transition Bas Carbone et le Réseau des Quartiers en Transition
        ne soient pas responsable des interruptions, et des conséquences qui
        peuvent en découler pour l’utilisateur ou tout tiers.
      </p>

      <h2 className="pb-2 pt-3 font-bold">
        Propriété intellectuelle et copyright
      </h2>
      <p>
        L&apos;Association pour la transition Bas Carbone et le Réseau des
        Quartiers en Transition sont propriétaires des droits de propriété
        intellectuelle ou détient les droits d’usage sur tous les éléments
        accessibles sur le site, notamment les textes, images, graphismes, logo,
        icônes, sons, logiciels et marques déposées.
      </p>
      <p className="pt-2">
        Par conséquent, toute reproduction, représentation, transmission,
        diffusion, partielle ou totale, est interdite selon les termes de
        l’article L. 122-4 du CPI sous réserve des exceptions prévues à
        l’article L. 122-5 du CPI. Toute utilisation de données figurant sur ce
        site nécessite une autorisation préalable et expresse. A défaut, le
        délit de contrefaçon constitué est sanctionné sur le fondement des
        articles L. 335-2 et suivants du CPI.
      </p>
      <p className="pt-2">
        L&apos;Association pour la transition Bas Carbone et le Réseau des
        Quartiers en Transition autorisent la réutilisation non commerciale et
        pédagogique des informations disponibles sur son site, à la condition de
        respecter l’intégrité des informations et de n’en altérer ni le sens, ni
        la portée, ni l’application et de faire mention des noms de
        l&apos;Association pour la transition Bas Carbone et du Réseau des
        Quartiers en Transition ou d’en préciser l’origine et la date de
        publication avec la mention du crédit photo si tel est le cas.
      </p>

      <h2 className="pb-2 pt-3 font-bold">Cookies de navigation</h2>
      <p>
        Pour vous permettre de bénéficier des services proposés par le site
        https://projetnear.org tels que sa consultation, l’optimisation de son
        utilisation ou sa personnalisation en fonction de l’internaute, le site
        https://projetnear.org utilise des Cookies. Pour connaître notre
        politique des cookies, vous êtes invités à cliquer sur le lien{" "}
        <Link href="/mentions-legales#personal-data">ici</Link>.
      </p>

      <h2 className="pb-2 pt-3 font-bold">Liens hypertextes</h2>
      <p>
        L’éditeur ne saurait engager sa responsabilité sur le contenu des
        informations figurant sur les pages auxquelles les liens hypertextes du
        présent site renvoient.
      </p>

      <h2 className="pb-2 pt-3 font-bold">Droits d’accès</h2>
      <p>
        Conformément au Règlement (UE) 2016/679 relatif à la protection des
        données à caractère personnel, vous disposez sur vos données des droit
        d’accès, droit de rectification et du droit d’opposition. Pour en savoir
        plus, vous pouvez consulter notre{" "}
        <Link href="/mentions-legales#personal-data">
          politique de protection des données
        </Link>
        .
      </p>

      <h2 className="pb-2 pt-3 font-bold">Droit applicable en cas de litige</h2>
      <p>Le droit applicable est le droit français.</p>
      <p className="pt-2">
        En cas de litige a l’occasion de l’interprétation ou de l’exécution des
        présentes conditions générales, la juridiction compétente sera
        déterminée au regard des dispositions de droit commun.
      </p>
    </div>
  );
};

export default LegalNotes;
