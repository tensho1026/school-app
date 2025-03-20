import Link from "next/link";

const Homepage = () => {
  return (
    <div className=' cursor-pointer'>
      <Link href='/list/teachers'>
        <p>こちらをクリックしてください</p>
      </Link>
    </div>
  );
};

export default Homepage;
