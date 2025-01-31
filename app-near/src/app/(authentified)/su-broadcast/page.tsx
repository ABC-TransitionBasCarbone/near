import Link from "next/link";
import SimpleBanner from "../../_components/_ui/SimpleBanner";
import BroadcastingPage from "../../_components/BroadcastingPage";

export default async function Home() {
  return (
    <>
      <SimpleBanner>
        <>
          <div className="my-4">
            <Link
              className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
              href="/"
            >
              &lt; Retour
            </Link>
          </div>

          {/* <LinkAsButton customStyle="px-0" border={false}></LinkAsButton> */}
          <h1 className="my-4 text-3xl text-black">
            Diffusion du questionnaire Sphère d&apos;usage
          </h1>
          <p>
            Choississez un ou plusieurs modes de diffusion pour votre
            questionnaire.
          </p>
        </>
      </SimpleBanner>
      <BroadcastingPage surveyType={"su"} />
    </>
  );
}
