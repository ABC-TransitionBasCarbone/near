import Link from "next/link";

const SurveyFooter: React.FC = () => {
  const logoStyle = "h-[35px] p-2 md:h-[61px]";
  const logosWrapper =
    "my-auto flex flex-wrap justify-center gap-8 rounded-lg bg-white";
  return (
    <div className="mt-5 flex min-h-[166px] flex-col gap-5 bg-[url(/images/pattern_vert.webp)]">
      <div className="items-center justify-between px-10 pt-14 md:flex md:flex-wrap">
        <div className={logosWrapper}>
          <img className={logoStyle} src="/logos/abc.webp" alt="" />
          <img className={logoStyle} src="/logos/reseau-qet.webp" alt="" />
          <img className={logoStyle} src="/logos/ville-paris.webp" alt="" />
          <img
            className={logoStyle}
            src="/logos/cooperative-carbone.webp"
            alt=""
          />
        </div>
        <div className={logosWrapper}>
          <img className={logoStyle} src="/logos/net-zero-cities.webp" alt="" />
          <img className={logoStyle} src="/logos/ue.webp" alt="" />
        </div>
      </div>
      <div className="text-center text-xs">
        © NEAR 2025 --{" "}
        <Link className="font-normal text-black" href="/mentions-legales">
          Mentions légales
        </Link>
      </div>
    </div>
  );
};

export default SurveyFooter;
