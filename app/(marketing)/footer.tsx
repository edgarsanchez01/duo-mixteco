import Image from "next/image";

import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <div className="hidden h-20 w-full border-t-2 border-slate-200 p-2 lg:block">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-evenly">
        {/* <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/hr.svg"
            alt="Croata"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Croata
        </Button> */}

        {/* <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/es.svg"
            alt="Español"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Español
        </Button> */}

        {/* <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/fr.svg"
            alt="Francés"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Francés
        </Button> */}

        {/* <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="/it.svg"
            alt="Italiano"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Italiano
        </Button> */}

        <Button size="lg" variant="ghost" className="w-full cursor-default">
          <Image
            src="https://i.blogs.es/3a92c4/lenguamix_zps63db59e0/1366_2000.jpg"
            alt="Japonés"
            height={32}
            width={40}
            className="mr-4 rounded-md"
          />
          Mixteco
        </Button>
      </div>
    </div>
  );
};
