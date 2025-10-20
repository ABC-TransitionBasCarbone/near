const FooterBackOffice: React.FC = () => {
  return (
    <footer>
      <ul className="flex flex-col gap-2 text-sm">
        <li>@Near {new Date().getFullYear()}</li>
      </ul>
    </footer>
  );
};

export default FooterBackOffice;
