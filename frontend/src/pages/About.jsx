import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsLetterBox from "../components/NewsLetterBox";
const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-10">
        <img src={assets.about_img} className="w-full md:max-w-[450px]" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero
            maxime fugiat incidunt ea ipsam provident, similique aspernatur
            nobis eveniet nemo suscipit eaque temporibus reprehenderit optio
            amet eligendi maiores? Veritatis, cumque.
          </p>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita
            labore inventore maxime quidem accusamus assumenda ipsam architecto
            necessitatibus reiciendis maiores ipsum aperiam eaque ipsa, eos hic
            distinctio quasi dolores perspiciatis beatae magni illum asperiores
            eum corrupti? Corrupti aspernatur optio tempore. Vitae facilis
            perspiciatis quaerat consequuntur quod sint? Soluta laborum quisquam
            adipisci. Obcaecati iusto eum enim minus perferendis, temporibus cum
            praesentium, illo sint nam autem itaque ex voluptatibus cupiditate,
            amet dolore exercitationem. Obcaecati quo consectetur, ex architecto
            hic suscipit, mollitia nihil nisi eveniet minima culpa odio
            exercitationem, reprehenderit quaerat dolore cumque unde aliquid ut
            optio consequuntur nesciunt numquam! Quas, quam quibusdam?
          </p>
          <b className="text-gray-800">Our Mission</b>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
            qui excepturi, fugit deleniti ipsa facere quidem est dolores quod
            adipisci voluptatum voluptate assumenda magni, eius praesentium
            expedita iste eligendi nam. Rem consectetur officiis dolorum
            expedita enim libero vitae vel aperiam molestiae earum, modi,
            dignissimos eum sed odit non nulla itaque.
          </p>
        </div>
      </div>
      <div className="text-4xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border border-gray-100 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            ab, ullam eligendi libero dicta obcaecati quis accusantium. Quis,
            officia modi!
          </p>
        </div>
        <div className="border border-gray-100 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero at
            temporibus voluptatem sunt ex. Quos ratione iste facere asperiores
            eum quasi maiores nemo blanditiis ipsam illo. Nam voluptatum
            reprehenderit ducimus.
          </p>
        </div>
        <div className="border border-gray-100 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero at
            temporibus voluptatem sunt ex. Quos ratione iste facere asperiores
            eum quasi maiores nemo blanditiis ipsam illo. Nam voluptatum
            reprehenderit ducimus.
          </p>
        </div>
      </div>

      <NewsLetterBox />
    </div>
  );
};

export default About;
