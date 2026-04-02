import api from '../api/AxiosInstance';
import { toast, ToastContainer, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CreatorDashboardPage() {
  const navigate = useNavigate();
  const [allArtwork, setAllArtwork] = useState([]);
  const [activeArtwork, setActiveArtwork] = useState([]);

  const fetchActiveArtwork = async () => {
    const response = await api.get('/api/artwork/active')
    setActiveArtwork(await response.data)
  }

  const fetchAllArtwork = async () => {
    const response = await api.get('/api/artwork')
    setAllArtwork(await response.data)
  }

  useEffect(() => {
    fetchAllArtwork()
    fetchActiveArtwork()
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const formData = new FormData();
    formData.append('artworkImage', form.artworkImageField.files[0]);
    formData.append('request', new Blob([JSON.stringify({
      title: form.title.value,
      price: form.price.value,
      yearCompleted: form.yearCompleted.value,
      forSale: form.forSale.checked,
      availableQuantity: form.availableQuantity.value
    })], { type: 'application/json' }));

    try {
      const response = await api.post('/api/artwork/admin/upload', formData, {
        headers: {
          'Content-Type': `multipart/form-data`,
        },
      });

      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data}</p>, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      form.reset();
      fetchAllArtwork()
      fetchActiveArtwork()

    } catch (err) {
      console.log(err)
    }
  }

  async function archiveArtwork(id) {
    try {
      console.log(id)
      const response = await api.post(`/api/artwork/admin/archive/${id}`, parseInt(id), {
        headers: {
          'Content-Type': `application/json`,
        }
      });

      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data}</p>, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      fetchAllArtwork()
      fetchActiveArtwork()

    } catch (err) {
      console.log(err)
    }
  }

  async function unarchiveArtwork(id) {
    try {
      console.log(id)
      const response = await api.post(`/api/artwork/admin/unarchive/${id}`, parseInt(id), {
        headers: {
          'Content-Type': `application/json`,
        }
      });

      toast.success(<p className="font-extrabold text-center text-lg mx-4">{response.data}</p>, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });

      fetchAllArtwork()
      fetchActiveArtwork()

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="flex justify-evenly my-8 px-16">
        <div className="flex-4 flex justify-around border-r-4 border-black/10 mx-4">
          <div className='flex-1/2 mx-4'>
            <h1 className='font-extrabold text-2xl underline text-center'>ACTIVE LISTINGS</h1>
            {activeArtwork.map((active) => (
              <div key={active.id} className="flex justify-between items-center my-2">
                <p>ID: {active.id} - {active.title} - ${active.price}</p>
                <button className='button-spcl' onClick={() => archiveArtwork(Number(active.id))}>Archive</button>
              </div>
            ))}
          </div>
          <div className='flex-1/2 mx-4'>
            <h1 className='font-extrabold text-2xl underline text-center'>INACTIVE LISTINGS</h1>
            {allArtwork.map((artwork) => (
              !artwork.active ?
                <div key={artwork.id} className="flex justify-between items-center my-2">
                  <p>ID: {artwork.id} - {artwork.title} - ${artwork.price}</p>
                  <button className='button-spcl' onClick={() => unarchiveArtwork(Number(artwork.id))}>Unarchive</button>
                </div> :
                null
            ))}
          </div>
        </div>
        <div className="flex-1/12 mx-4">
          <h1 className='text-center font-extrabold text-2xl underline'>NEW LISTING</h1>
          <form className='flex flex-col *:py-3 [&>input]:border [&>input]:text-center [&>input]:px-4 [&>label]:text-center' onSubmit={handleSubmit}>
            <label htmlFor='artworkImageField'>Artwork Image</label>
            <input type='file' name='artworkImageField' />
            <label htmlFor='title'>Title</label>
            <input type='text' name='title' />
            <div className='flex justify-evenly mt-4 [&>input]:text-center'>
              <label htmlFor='price'>Price</label>
              <input
                type='text'
                name='price'
                onKeyDown={e => {
                  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
                  if (allowed.includes(e.key)) return
                  if (!/[\d.]/.test(e.key)) { e.preventDefault(); return }
                  if (e.key === '.' && e.target.value.includes('.')) e.preventDefault()
                }}
              />
              <label htmlFor='yearCompleted'>Year Completed</label>
              <input type='text' name='yearCompleted' />
            </div>
            <div className="flex justify-evenly mt-4">
              <label htmlFor="forSale">For Sale?</label>
              <input type="checkbox" name="forSale" />
              <label htmlFor='availableQuantity'>Available Quantity</label>
              <input type='number' name='availableQuantity' className='text-center' />
            </div>
            <button className='mt-8 button-spcl' type='submit'>ADD ARTWORK</button>
          </form>
        </div>
      </div>
    </>
  )
}
