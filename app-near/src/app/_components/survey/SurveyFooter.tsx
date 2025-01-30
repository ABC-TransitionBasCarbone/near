const SurveyFooter: React.FC = () => {
  return (
    <div className="my-8 flex flex-col gap-8">
      <div className="flex flex-wrap justify-center gap-8 bg-yellowLight px-12 py-4 md:justify-between">
        <div className="my-auto flex flex-wrap justify-center gap-8">
          <img className="h-[61px]" src="/logos/abc.webp" alt="" />
          <img className="h-[61px]" src="/logos/reseau-qet.webp" alt="" />
          <img
            className="h-[61px]"
            src="/logos/cooperative-carbone.webp"
            alt=""
          />
          <img className="h-[61px]" src="/logos/ville-paris.webp" alt="" />
        </div>
        <div className="my-auto flex flex-wrap justify-center gap-8">
          <img className="h-[61px]" src="/logos/net-zero-cities.webp" alt="" />
          <img className="h-[61px]" src="/logos/ue.webp" alt="" />
        </div>
      </div>
      <div className="text-center">© NEAR 2025 -- Mentions légales</div>
    </div>
  );
};

export default SurveyFooter;
