import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-2">Bienvenue dans le back-office</h1>

      <div>
        <div>Vous pouvez</div>
        <ul className="list-inside list-disc">
          <li>
            <Link href={"/back-office/quartiers"}>Créer des quartiers</Link>
          </li>
          <li>
            <Link href={"/back-office/utilisateurs"}>
              Créer des pilotes d&apos;enquête et les associer à des quartiers
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
