import React ,{ useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FcLeft } from 'react-icons/fc'

const PostDetail = () => {
  const [post, setPost] = useState({});
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(error => console.error('Error fetching post: ', error));
  }, [id]);

  return (<>
    {/* post content */}
    <div>

      <div className="flex flex-col justify-center items-center mt-[1.5rem]">
        <p className="flex-1 text-center text-[2rem] font-bold">{post.title}</p>
        {/* {new Date().toLocaleDateString('en-us', { weekday:"long", month:"long", day:"numeric"})} */}
        <p>{post.date}</p>
        <p className="italic mt-[1rem] mb-[2rem]">By: {post.author}</p>
      </div>

      <div className="ml-[5rem] w-[6rem] flex flex-col text-[1.1rem] font-[500]">
        <p className="m-auto"><a href='/'><FcLeft className=""/></a></p>
        <p className="m-auto text-[blue]"><a href='/'>Back Home</a></p>
      </div>

      <div className="flex flex-col items-center m-auto w-[60%]">
        <div className="text-[1.1rem]" dangerouslySetInnerHTML={{__html: post.content}}></div>
      </div>

    </div>

    <div className='flex absolute bottom-0 pl-[.3rem] text-[.8rem]'>
    <p>Powered by <a href='https://github.com/wuzue/dragoncms' target='_blank'><span className='font-bold'>DragonCMS</span></a></p>
    </div>
  </>);
};

export default PostDetail;