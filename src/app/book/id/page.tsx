import { Button } from "@/components/ui/button";
import { ArrowLeft, Cog } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <main className="">
      <div className="w-full flex justify-between px-4 py-2 shadow-md shadow-slate-800 fixed top-0 left-0">
        <div className="flex items-center gap-4">
          <Button
            variant={"ghost"}
            size={"icon-lg"}
            className="border border-slate-700"
            asChild
          >
            <Link href={"/"}>
              <ArrowLeft />
            </Link>
          </Button>
          <div className="flex gap-2 text-xl cursor-default select-none">
            <p>Nombre del libro</p>|<p>Chapter 1</p>
          </div>
        </div>
        <div className="">
          <Button variant={"ghost"} size={"icon-lg"} className="border">
            <Cog />
          </Button>
        </div>
      </div>
      <div className="mt-14 px-12 pt-4 max-w-7xl">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita,
        veritatis fugit voluptate nam fuga eum animi! Dolorem quod dolore omnis
        accusantium. Sunt debitis impedit esse odit animi voluptatibus
        laudantium corrupti? Lorem ipsum dolor sit amet, consectetur adipisicing
        elit. Quis ducimus, voluptatibus exercitationem accusantium sint ipsum
        non ullam possimus cumque distinctio? Porro, culpa saepe! Eum sed
        voluptatum sit voluptates tenetur quisquam. Quos, voluptatum aliquam?
        Porro, ipsa sunt! Voluptatum non facilis natus animi corporis.
        Perspiciatis, laborum, alias natus quod ut nemo consequatur iste officia
        soluta eos a blanditiis maiores. Ipsum, dolorem non! Porro sunt
        assumenda aliquid rerum deleniti architecto deserunt similique ducimus
        dicta voluptatibus eligendi omnis minus expedita necessitatibus quisquam
        explicabo, dolorum possimus cumque alias doloremque itaque sequi hic
        excepturi? Ducimus, quis. Ad, explicabo quas, vero cupiditate, natus
        nemo consequatur sed culpa aut dicta quae totam nisi! Ab nesciunt
        explicabo placeat magni illo accusamus corrupti, sapiente molestias,
        dolorum molestiae cum tempora aut. Placeat perferendis, soluta sunt
        facere eius dolores impedit sequi ex consectetur eos ab excepturi
        maiores enim ut aliquam voluptates, velit doloremque, consequuntur porro
        tempore molestias. Officia minus suscipit quas provident? Illum, sit
        tenetur pariatur accusamus consectetur doloremque enim minus quia eius
        quibusdam eveniet quod? Eligendi, voluptate vel accusamus itaque ex
        doloribus harum optio veniam in atque temporibus corrupti illo
        obcaecati. Ipsa, perspiciatis! Expedita corporis ut magni mollitia
        assumenda dolores fugit vero. Eius explicabo quidem omnis nisi nesciunt
        ratione. Eum, beatae. Ut quidem eum blanditiis recusandae ratione.
        Voluptatum eum neque alias! Repellendus ipsum tenetur dolorem mollitia a
        maxime doloremque asperiores neque modi culpa ex deserunt dolorum
        expedita laboriosam exercitationem amet ducimus sint ullam, explicabo
        fugit ea soluta. Obcaecati mollitia a ea. Veritatis voluptates, ex non
        at provident repellat reiciendis adipisci in molestiae ipsum nihil, qui
        dolor itaque hic eveniet error nam iure aliquam fugit minima natus illo
        laboriosam molestias? Amet, perferendis? Nobis enim consectetur
        perferendis non quis nemo, cupiditate eius natus, voluptatum a nulla.
        Accusamus natus vero officia, in, corporis laboriosam, veniam labore
        optio debitis dolor aut voluptate reiciendis nostrum accusantium.
      </div>
    </main>
  );
};

export default page;
