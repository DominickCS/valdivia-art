import api from '../api/AxiosInstance';
import { toast, ToastContainer, Bounce } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import type { Artwork } from '../types/definitions';

interface ImageFile {
  file: File;
  preview: string;
  position: number;
  isPrimary: boolean;
}

export default function CreatorDashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [allArtwork, setAllArtwork] = useState([]);
  const [activeArtwork, setActiveArtwork] = useState([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const fetchActiveArtwork = async () => {
    const response = await api.get('/api/artwork/active');
    setActiveArtwork(await response.data);
  };

  const fetchAllArtwork = async () => {
    const response = await api.get('/api/artwork');
    setAllArtwork(await response.data);
  };

  useEffect(() => {
    fetchAllArtwork();
    fetchActiveArtwork();
  }, []);

  useEffect(() => {
    return () => images.forEach(img => URL.revokeObjectURL(img.preview));
  }, [images]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const newImages: ImageFile[] = files.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      position: images.length + i,
      isPrimary: images.length === 0 && i === 0,
    }));
    setImages(prev => [...prev, ...newImages]);
  }

  function handleDragStart(index: number) { dragIndex.current = index; }
  function handleDragEnter(index: number) { dragOverIndex.current = index; }

  function handleDragEnd() {
    if (dragIndex.current === null || dragOverIndex.current === null) return;
    if (dragIndex.current === dragOverIndex.current) return;
    setImages(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex.current!, 1);
      updated.splice(dragOverIndex.current!, 0, moved);
      return updated.map((img, i) => ({ ...img, position: i, isPrimary: i === 0 }));
    });
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  function removeImage(index: number) {
    setImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((img, i) => ({ ...img, position: i, isPrimary: i === 0 }));
    });
  }

  function setPrimary(index: number) {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error(<p className="font-extrabold text-center text-lg px-4">Please add at least one image.</p>, {
        position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce,
      });
      return;
    }
    const form = e.target as HTMLFormElement & {
      price: HTMLInputElement; heightInches: HTMLInputElement;
      widthInches: HTMLInputElement; yearCompleted: HTMLInputElement;
      forSale: HTMLInputElement; availableQuantity: HTMLInputElement;
    };
    const primaryIndex = images.findIndex(img => img.isPrimary);
    const formData = new FormData();
    images.forEach(img => formData.append("images", img.file));
    formData.append('request', new Blob([JSON.stringify({
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      price: form.price.value,
      yearCompleted: form.yearCompleted.value,
      heightInches: form.heightInches.value,
      widthInches: form.widthInches.value,
      forSale: form.forSale.checked,
      availableQuantity: form.availableQuantity.value,
      primaryImageIndex: primaryIndex,
    })], { type: 'application/json' }));
    try {
      setIsLoading(true);
      const response = await api.post('/api/artwork/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data}</p>, {
        position: "bottom-center", autoClose: 2000, hideProgressBar: false,
        closeOnClick: false, pauseOnHover: true, draggable: true, theme: "light", transition: Bounce,
      });
      form.reset();
      setImages([]);
      fetchAllArtwork();
      fetchActiveArtwork();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err instanceof Error) {
        toast.error(<p className="font-extrabold text-center text-lg px-4">{err.message}</p>, {
          position: "bottom-center", autoClose: 2000, hideProgressBar: false,
          closeOnClick: false, pauseOnHover: true, draggable: true, theme: "light", transition: Bounce,
        });
      }
    }
  }

  async function archiveArtwork(id: string) {
    try {
      const response = await api.post(`/api/artwork/admin/archive/${id}`, parseInt(id), {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data}</p>, {
        position: "bottom-center", autoClose: 2000, hideProgressBar: false,
        closeOnClick: false, pauseOnHover: true, draggable: true, theme: "light", transition: Bounce,
      });
      fetchAllArtwork(); fetchActiveArtwork();
    } catch (err) {
      if (err instanceof Error)
        toast.error(<p className="font-extrabold text-center text-lg px-4">{err.message}</p>, {
          position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce,
        });
    }
  }

  async function unarchiveArtwork(id: string) {
    try {
      const response = await api.post(`/api/artwork/admin/unarchive/${id}`, parseInt(id), {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success(<p className="font-extrabold text-center text-lg mx-4">{response.data}</p>, {
        position: "bottom-center", autoClose: 2000, hideProgressBar: false,
        closeOnClick: false, pauseOnHover: true, draggable: true, theme: "light", transition: Bounce,
      });
      fetchAllArtwork(); fetchActiveArtwork();
    } catch (err) {
      if (err instanceof Error)
        toast.error(<p className="font-extrabold text-center text-lg px-4">{err.message}</p>, {
          position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce,
        });
    }
  }

  return (
    <>
      <ToastContainer />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Listings ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Active listings */}
          <section className="border border-black/10 rounded-lg p-5">
            <h2 className="font-extrabold text-base underline text-center mb-4 tracking-wide">
              ACTIVE LISTINGS
            </h2>
            {activeArtwork.length === 0 ? (
              <p className="text-center text-sm text-black/30 py-4">No active listings.</p>
            ) : (
              <ul className="divide-y divide-black/5">
                {activeArtwork.map((active: Artwork) => (
                  <li key={active.id} className="flex items-center justify-between gap-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{active.title}</p>
                      <p className="text-xs text-black/40">#{active.id} · ${active.price}</p>
                    </div>
                    <button
                      className="button-spcl shrink-0 text-xs py-1 px-3"
                      onClick={() => archiveArtwork(Number(active.id).toString())}
                    >
                      Archive
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Inactive listings */}
          <section className="border border-black/10 rounded-lg p-5">
            <h2 className="font-extrabold text-base underline text-center mb-4 tracking-wide">
              INACTIVE LISTINGS
            </h2>
            {allArtwork.filter((a: Artwork) => !a.active).length === 0 ? (
              <p className="text-center text-sm text-black/30 py-4">No inactive listings.</p>
            ) : (
              <ul className="divide-y divide-black/5">
                {allArtwork.map((artwork: Artwork) =>
                  !artwork.active ? (
                    <li key={artwork.id} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{artwork.title}</p>
                        <p className="text-xs text-black/40">#{artwork.id} · ${artwork.price}</p>
                      </div>
                      <button
                        className="button-spcl shrink-0 text-xs py-1 px-3"
                        onClick={() => unarchiveArtwork(Number(artwork.id).toString())}
                      >
                        Unarchive
                      </button>
                    </li>
                  ) : null
                )}
              </ul>
            )}
          </section>
        </div>

        {/* ── Upload form ── */}
        <section className="border border-black/10 rounded-lg p-5 sm:p-8">
          <h2 className="font-extrabold text-base underline text-center mb-6 tracking-wide">
            NEW LISTING
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">

            {/* Images */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-center">Artwork Images</label>
              <input
                id="artworkImageField"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.tiff"
                onChange={handleImageSelect}
                onClick={e => { (e.target as HTMLInputElement).value = ''; }}
                className="block w-full text-sm border border-black/20 rounded px-3 py-2"
              />
              {images.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-center text-black/40 mb-3">
                    Drag to reorder · First is primary · Tap ★ to change
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {images.map((img, index) => (
                      <div
                        key={img.preview}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={e => e.preventDefault()}
                        className="relative w-20 h-20 cursor-grab active:cursor-grabbing border-2 rounded overflow-hidden select-none"
                        style={{ borderColor: img.isPrimary ? '#000' : '#d1d5db' }}
                      >
                        <img src={img.preview} alt={`preview-${index}`} className="w-full h-full object-cover" />
                        <span className="absolute top-0 left-0 bg-black/60 text-white text-[10px] px-1 leading-5">
                          {index + 1}
                        </span>
                        {img.isPrimary ? (
                          <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[9px] text-center leading-4">
                            PRIMARY
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPrimary(index)}
                            className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] text-center leading-4 hover:bg-black/70 transition-colors"
                            title="Set as primary"
                          >
                            ★
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-black/60 text-white text-[10px] w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-center">Title</label>
              <input
                type="text"
                name="title"
                className="block w-full border border-black/20 rounded px-3 py-2 text-sm text-center"
              />
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-center">Height (in)</label>
                <input
                  type="text"
                  name="heightInches"
                  className="block w-full border border-black/20 rounded px-3 py-2 text-sm text-center"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-center">Width (in)</label>
                <input
                  type="text"
                  name="widthInches"
                  className="block w-full border border-black/20 rounded px-3 py-2 text-sm text-center"
                />
              </div>
            </div>

            {/* Price + Year */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-center">Price ($)</label>
                <input
                  type="text"
                  name="price"
                  className="block w-full border border-black/20 rounded px-3 py-2 text-sm text-center"
                  onKeyDown={e => {
                    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                    if (allowed.includes(e.key)) return;
                    if (!/[\d.]/.test(e.key)) { e.preventDefault(); return; }
                    if (e.key === '.' && (e.target as HTMLInputElement).value.includes('.')) e.preventDefault();
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-center">Year</label>
                <input
                  type="text"
                  name="yearCompleted"
                  className="block w-full border border-black/20 rounded px-3 py-2 text-sm text-center"
                />
              </div>
            </div>

            {/* For Sale + Quantity */}
            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="flex flex-col items-center gap-2">
                <label className="text-sm font-semibold">For Sale?</label>
                <input type="checkbox" name="forSale" className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-center">Available Qty</label>
                <input
                  type="number"
                  name="availableQuantity"
                  className="block w-full border border-black/20 rounded px-3 py-2 text-sm text-center"
                />
              </div>
            </div>

            <button
              className="button-spcl w-full py-3 mt-2"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "PLEASE WAIT..." : "ADD ARTWORK"}
            </button>
          </form>
        </section>

      </div>
    </>
  );
}
