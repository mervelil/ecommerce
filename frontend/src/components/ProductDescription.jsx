import React from 'react'

const ProductDescription = () => {
  return (
    <div className='mt-20'>
      <div className='flex gap-3 mb-4'>
        <button className='btn_dark_rounded !rounded-none !text-xs !py-[6px] w-36'>Description </button>
        <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Care Guide </button>
        <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Size Guide </button>
      </div>
      <div className='flex flex-col pb-16'>
          <p className='text-sm'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt beatae cumque illo sapiente tempore magni accusamus qui, id nisi in libero et, dolor totam consectetur labore nostrum expedita dolorem excepturi. Aliquid labore porro nihil quos voluptate eos sit quisquam fuga, maxime quasi doloremque est vel obcaecati eveniet debitis tenetur, impedit dignissimos repellat eius. Ea, laboriosam?</p>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum quasi suscipit culpa officiis dolores consequatur ratione sed at. Accusantium, nisi incidunt? Similique eum odio, aperiam quis non fuga.</p>
      </div>
    </div>
  )
}

export default ProductDescription
