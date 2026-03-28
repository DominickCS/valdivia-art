import NavigationBar from "../components/NavigationBar";
import api from '../api/AxiosInstance';
import { toast, ToastContainer, Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreatorDashboardPage() {
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const formData = new FormData();
    formData.append('artworkImage', form.artworkImageField.files[0]);
    formData.append('request', new Blob([JSON.stringify({
      title: form.title.value,
      price: form.price.value,
      isForSale: form.isForSale.value == "on" ? true : false,
      isActive: form.isActive.value == "on" ? true : false
    })], { type: 'application/json' }));

    try {
      const response = await api.post('/api/artwork/admin/upload', formData, {
        headers: {
          'Content-Type': `multipart/form-data`,
        },
      });

      toast.success(<p className="font-extrabold text-center text-lg">{response.data}</p>, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        transition: Bounce,
      });

      setTimeout(() => navigate("/"), 3000);

    } catch (err) {
      console.log(err)
    }
  }


  return (
    <>
      <ToastContainer />
      <NavigationBar />
      <div className="flex justify-evenly px-16 [&>div]:px-8">
        <div className="flex-4 border-2">
          CONTROLS
        </div>
        <div className="flex-1/12">
          <form className='flex flex-col *:py-3 [&>input]:border [&>input]:text-center [&>input]:px-4 [&>label]:text-center' onSubmit={handleSubmit}>
            <label htmlFor='artworkImageField'>Artwork Image</label>
            <input type='file' name='artworkImageField' />
            <label htmlFor='title'>Title</label>
            <input type='text' name='title' />
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
            <div className="flex justify-evenly mt-4">
              <label htmlFor="isForSale">For Sale?</label>
              <input type="checkbox" name="isForSale" />
              <label htmlFor="isActive">Current Work?</label>
              <input type="checkbox" name="isActive" />
            </div>
            <input className='mt-8' type='submit' value={"ADD ARTWORK"} />
          </form>
        </div>
      </div>
    </>
  )
}
