import api from '../api/AxiosInstance';
import { toast, ToastContainer, Bounce } from "react-toastify";
import { useEffect, useState } from "react";
import type { Artwork, Order } from '../types/definitions';

interface ImageFile {
  file: File;
  preview: string;
  position: number;
  isPrimary: boolean;
}

interface ShipForm {
  orderId: number;
  trackingNumber: string;
  carrier: string;
}

interface ArtworkImage {
  id: number;
  imageURL: string;
  displayOrder: number;
  isPrimary: boolean;
}

interface EditForm {
  artworkId: number;
  title: string;
  price: string;
  heightInches: string;
  widthInches: string;
  lengthInches: string;
  weight: string;
  yearCompleted: string;
  forSale: boolean;
  availableQuantity: string;
  existingImages: ArtworkImage[];
  newImages: ImageFile[];
  removedImageIds: number[];
}

export default function CreatorDashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [allArtwork, setAllArtwork] = useState([]);
  const [activeArtwork, setActiveArtwork] = useState([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipForm, setShipForm] = useState<ShipForm | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fetchActiveArtwork = async () => {
    const response = await api.get('/api/artwork/active');
    setActiveArtwork(response.data);
  };

  const fetchAllArtwork = async () => {
    const response = await api.get('/api/artwork');
    setAllArtwork(response.data);
  };

  const fetchOrders = async () => {
    const response = await api.get('/api/admin/orders/all');
    setOrders(response.data);
  };

  useEffect(() => {
    fetchAllArtwork();
    fetchActiveArtwork();
    fetchOrders();
  }, []);

  // Cleanup upload-form previews
  useEffect(() => {
    return () => images.forEach(img => URL.revokeObjectURL(img.preview));
  }, [images]);

  // Cleanup edit-form new-image previews on unmount/close
  useEffect(() => {
    return () => editForm?.newImages.forEach(img => URL.revokeObjectURL(img.preview));
  }, [editForm]);

  // ── Upload form handlers ──────────────────────────────────────────────────

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

  function handleDragStart(index: number) { setDragIndex(index); }
  function handleDragEnter(index: number) { setDragOverIndex(index); }

  function handleDragEnd() {
    if (dragIndex === null || dragOverIndex === null) return;
    if (dragIndex !== dragOverIndex) {
      setImages(prev => {
        const updated = [...prev];
        const [moved] = updated.splice(dragIndex, 1);
        updated.splice(dragOverIndex, 0, moved);
        return updated.map((img, i) => ({ ...img, position: i, isPrimary: i === 0 }));
      });
    }
    setDragIndex(null);
    setDragOverIndex(null);
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
      lengthInches: form.lengthInches.value,
      weight: form.weight.value,
      forSale: form.forSale.checked,
      availableQuantity: form.availableQuantity.value,
      primaryImageIndex: primaryIndex,
    })], { type: 'application/json' }));
    try {
      setIsLoading(true);
      const response = await api.post('/api/admin/upload', formData, {
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
      if (err instanceof Error)
        toast.error(<p className="font-extrabold text-center text-lg px-4">{err.message}</p>, {
          position: "bottom-center", autoClose: 2000, hideProgressBar: false,
          closeOnClick: false, pauseOnHover: true, draggable: true, theme: "light", transition: Bounce,
        });
    }
  }

  // ── Archive / Unarchive ───────────────────────────────────────────────────

  async function archiveArtwork(id: string) {
    try {
      const response = await api.post(`/api/admin/archive/${id}`, parseInt(id), {
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
      const response = await api.post(`/api/admin/unarchive/${id}`, parseInt(id), {
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

  // ── Edit listing ─────────────────────────────────────────────────────────

  async function openEditForm(artwork: Artwork) {
    // Close any open ship form
    setShipForm(null);

    // If clicking the same item, toggle closed
    if (editForm?.artworkId === artwork.id) {
      editForm.newImages.forEach(img => URL.revokeObjectURL(img.preview));
      setEditForm(null);
      return;
    }

    // Fetch full artwork detail (includes images array) from existing endpoint
    try {
      const response = await api.get(`/api/artwork/listing/${artwork.id}`);
      const detail = response.data;
      setEditForm({
        artworkId: artwork.id,
        title: detail.title ?? artwork.title ?? '',
        price: String(detail.price ?? artwork.price ?? ''),
        heightInches: String(detail.heightInches ?? ''),
        widthInches: String(detail.widthInches ?? ''),
        lengthInches: String(detail.lengthInches ?? ''),
        weight: String(detail.weight ?? ''),
        yearCompleted: String(detail.yearCompleted ?? ''),
        forSale: detail.forSale ?? false,
        availableQuantity: String(detail.availableQuantity ?? ''),
        existingImages: detail.images ?? [],
        newImages: [],
        removedImageIds: [],
      });
    } catch {
      // Fallback: open with data we already have, no images shown
      setEditForm({
        artworkId: artwork.id,
        title: artwork.title ?? '',
        price: String(artwork.price ?? ''),
        heightInches: '',
        widthInches: '',
        lengthInches: '',
        weight: '',
        yearCompleted: '',
        forSale: false,
        availableQuantity: '',
        existingImages: [],
        newImages: [],
        removedImageIds: [],
      });
    }
  }

  function closeEditForm() {
    editForm?.newImages.forEach(img => URL.revokeObjectURL(img.preview));
    setEditForm(null);
  }

  function editRemoveExistingImage(imageId: number) {
    setEditForm(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        existingImages: prev.existingImages.filter(img => img.id !== imageId),
        removedImageIds: [...prev.removedImageIds, imageId],
      };
    });
  }

  function editHandleNewImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setEditForm(prev => {
      if (!prev) return prev;
      const offset = prev.existingImages.length + prev.newImages.length;
      const added: ImageFile[] = files.map((file, i) => ({
        file,
        preview: URL.createObjectURL(file),
        position: offset + i,
        isPrimary: false,
      }));
      return { ...prev, newImages: [...prev.newImages, ...added] };
    });
  }

  function editRemoveNewImage(index: number) {
    setEditForm(prev => {
      if (!prev) return prev;
      URL.revokeObjectURL(prev.newImages[index].preview);
      const updated = prev.newImages.filter((_, i) => i !== index);
      return { ...prev, newImages: updated };
    });
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm) return;

    const remainingImages = editForm.existingImages.length + editForm.newImages.length;
    if (remainingImages === 0) {
      toast.error(
        <p className="font-extrabold text-center text-lg px-4">A listing must have at least one image.</p>,
        { position: "bottom-center", autoClose: 2500, theme: "light", transition: Bounce }
      );
      return;
    }

    try {
      setIsSavingEdit(true);

      const formData = new FormData();

      // Append new image files in pool order (backend appends them after existing images)
      editForm.newImages.forEach(img => formData.append("newImages", img.file));

      // Send existing image IDs in their current pool order so the backend
      // can reassign displayOrder correctly after removes/adds.
      const imageOrder = editForm.existingImages.map(img => img.id);

      formData.append('request', new Blob([JSON.stringify({
        title: editForm.title,
        price: editForm.price,
        heightInches: editForm.heightInches,
        widthInches: editForm.widthInches,
        lengthInches: editForm.lengthInches,
        yearCompleted: editForm.yearCompleted,
        forSale: editForm.forSale,
        availableQuantity: editForm.availableQuantity,
        removeImageIds: editForm.removedImageIds,
        imageOrder,
      })], { type: 'application/json' }));

      const response = await api.patch(`/api/admin/artwork/${editForm.artworkId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(
        <p className="font-extrabold text-center text-lg px-4">{response.data}</p>,
        { position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce }
      );

      closeEditForm();
      fetchAllArtwork();
      fetchActiveArtwork();
    } catch (err) {
      if (err instanceof Error)
        toast.error(
          <p className="font-extrabold text-center text-lg px-4">{err.message}</p>,
          { position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce }
        );
    } finally {
      setIsSavingEdit(false);
    }
  }

  // ── Ship order ────────────────────────────────────────────────────────────

  async function handleMarkShipped(e: React.FormEvent) {
    e.preventDefault();
    if (!shipForm) return;
    try {
      const response = await api.patch(`/api/admin/orders/${shipForm.orderId}/ship`, {
        trackingNumber: shipForm.trackingNumber,
        carrier: shipForm.carrier,
      });
      toast.success(<p className="font-extrabold text-center text-lg px-4">{response.data}</p>, {
        position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce,
      });
      setShipForm(null);
      fetchOrders();
    } catch (err) {
      if (err instanceof Error)
        toast.error(<p className="font-extrabold text-center text-lg px-4">{err.message}</p>, {
          position: "bottom-center", autoClose: 2000, theme: "light", transition: Bounce,
        });
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

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
                  <>
                    <li key={active.id} className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{active.title}</p>
                        <p className="text-xs text-black/40">#{active.id} · ${active.price}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          className="button-spcl text-xs py-1 px-3"
                          onClick={() => openEditForm(active)}
                        >
                          {editForm?.artworkId === active.id ? 'Close' : 'Edit'}
                        </button>
                        <button
                          className="button-spcl text-xs py-1 px-3"
                          onClick={() => archiveArtwork(Number(active.id).toString())}
                        >
                          Archive
                        </button>
                      </div>
                    </li>

                    {/* Inline edit panel */}
                    {editForm?.artworkId === active.id && (
                      <li key={`edit-${active.id}`} className="py-3">
                        <EditPanel
                          editForm={editForm}
                          setEditForm={setEditForm}
                          isSavingEdit={isSavingEdit}
                          onSave={handleSaveEdit}
                          onClose={closeEditForm}
                          onRemoveExistingImage={editRemoveExistingImage}
                          onAddNewImages={editHandleNewImageSelect}
                          onRemoveNewImage={editRemoveNewImage}
                        />
                      </li>
                    )}
                  </>
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
                    <>
                      <li key={artwork.id} className="flex items-center justify-between gap-3 py-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">{artwork.title}</p>
                          <p className="text-xs text-black/40">#{artwork.id} · ${artwork.price}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            className="button-spcl text-xs py-1 px-3"
                            onClick={() => openEditForm(artwork)}
                          >
                            {editForm?.artworkId === artwork.id ? 'Close' : 'Edit'}
                          </button>
                          <button
                            className="button-spcl text-xs py-1 px-3"
                            onClick={() => unarchiveArtwork(Number(artwork.id).toString())}
                          >
                            Unarchive
                          </button>
                        </div>
                      </li>

                      {/* Inline edit panel */}
                      {editForm?.artworkId === artwork.id && (
                        <li key={`edit-${artwork.id}`} className="py-3">
                          <EditPanel
                            editForm={editForm}
                            setEditForm={setEditForm}
                            isSavingEdit={isSavingEdit}
                            onSave={handleSaveEdit}
                            onClose={closeEditForm}
                            onRemoveExistingImage={editRemoveExistingImage}
                            onAddNewImages={editHandleNewImageSelect}
                            onRemoveNewImage={editRemoveNewImage}
                          />
                        </li>
                      )}
                    </>
                  ) : null
                )}
              </ul>
            )}
          </section>
        </div>

        {/* ── Orders ── */}
        <section className="border border-black/10 rounded-lg p-5">
          <h2 className="font-extrabold text-base underline text-center mb-4 tracking-wide">
            ORDERS
          </h2>
          {orders.length === 0 ? (
            <p className="text-center text-sm text-black/30 py-4">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-black/5">
              {orders.map(order => (
                <li key={order.id} className="py-3 space-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-sm font-semibold truncate">{order.artworkTitle}</p>
                      <p className="text-xs text-black/40">
                        #{order.id} · {order.shippingName} · ${(order.amountTotal / 100).toFixed(2)}
                      </p>
                      <p className="text-xs text-black/40">
                        {order.shippingLine1}
                        {order.shippingLine2 ? `, ${order.shippingLine2}` : ''}, {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
                      </p>
                      {order.trackingNumber && (
                        <a
                          href={order.trackingURL ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs underline text-black/60 hover:text-black transition-colors"
                        >
                          {order.trackingNumber}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] tracking-widest font-semibold px-2 py-0.5 rounded ${order.status === 'SHIPPED' ? 'bg-black/10 text-black/60' :
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                          order.status === 'REFUNDED' ? 'bg-red-100 text-red-600' :
                            'bg-yellow-50 text-yellow-700'
                        }`}>
                        {order.status}
                      </span>
                      {order.status === 'PENDING' && (
                        <button
                          className="button-spcl text-xs py-1 px-3"
                          onClick={() => setShipForm({ orderId: order.id, trackingNumber: '', carrier: 'UPS' })}
                        >
                          Mark Shipped
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline ship form */}
                  {shipForm?.orderId === order.id && (
                    <form onSubmit={handleMarkShipped} className="flex flex-col sm:flex-row gap-2 pt-2">
                      <select
                        value={shipForm.carrier}
                        onChange={e => setShipForm(f => f ? { ...f, carrier: e.target.value } : f)}
                        className="border border-black/20 rounded px-2 py-1.5 text-xs"
                      >
                        <option value="UPS">UPS</option>
                        <option value="USPS">USPS</option>
                        <option value="FEDEX">FedEx</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Tracking number"
                        value={shipForm.trackingNumber}
                        onChange={e => setShipForm(f => f ? { ...f, trackingNumber: e.target.value } : f)}
                        className="flex-1 border border-black/20 rounded px-2 py-1.5 text-xs"
                        required
                      />
                      <div className="flex gap-2">
                        <button type="submit" className="button-spcl text-xs py-1 px-3">
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setShipForm(null)}
                          className="button-spcl text-xs py-1 px-3 opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

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
                        className="relative w-20 h-20 cursor-grab active:cursor-grabbing border-2 rounded overflow-hidden select-none transition-all duration-150"
                        style={{
                          borderColor: dragOverIndex === index && dragIndex !== index
                            ? '#000'
                            : img.isPrimary ? '#000' : '#d1d5db',
                          opacity: dragIndex === index ? 0.35 : 1,
                          transform: dragOverIndex === index && dragIndex !== index
                            ? 'scale(1.08)' : 'scale(1)',
                        }}
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
            <div className="grid grid-cols-3 gap-3">
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
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-center">Length (in)</label>
                <input
                  type="text"
                  name="lengthInches"
                  className="block w-full border border-black/20 rounded px-3 py-2 text-sm text-center"
                />
              </div>
            </div>

            {/* Price + Year + Weight*/}
            <div className="grid grid-cols-3 gap-3">
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
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-center">Weight (lbs)</label>
                <input
                  type="text"
                  name="weight"
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

// ── EditPanel sub-component ───────────────────────────────────────────────────

interface EditPanelProps {
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm | null>>;
  isSavingEdit: boolean;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
  onRemoveExistingImage: (id: number) => void;
  onAddNewImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveNewImage: (index: number) => void;
}

// Flat item in the unified drag pool
type PoolItem =
  | { kind: 'existing'; img: ArtworkImage }
  | { kind: 'new'; img: ImageFile; newIndex: number };

function EditPanel({
  editForm,
  setEditForm,
  isSavingEdit,
  onSave,
  onClose,
  onRemoveExistingImage,
  onAddNewImages,
  onRemoveNewImage,
}: EditPanelProps) {
  const set = (field: keyof EditForm, value: unknown) =>
    setEditForm(prev => prev ? { ...prev, [field]: value } : prev);

  const [editDragIndex, setEditDragIndex] = useState<number | null>(null);
  const [editDragOverIndex, setEditDragOverIndex] = useState<number | null>(null);

  // Build a single flat pool from both lists so drag can cross the boundary
  const pool: PoolItem[] = [
    ...editForm.existingImages.map(img => ({ kind: 'existing' as const, img })),
    ...editForm.newImages.map((img, newIndex) => ({ kind: 'new' as const, img, newIndex })),
  ];

  function handleEditDragEnd() {
    if (editDragIndex === null || editDragOverIndex === null || editDragIndex === editDragOverIndex) {
      setEditDragIndex(null);
      setEditDragOverIndex(null);
      return;
    }

    // Reorder the flat pool then split back into existing/new
    const reordered = [...pool];
    const [moved] = reordered.splice(editDragIndex, 1);
    reordered.splice(editDragOverIndex, 0, moved);

    const newExisting: ArtworkImage[] = reordered
      .filter((item): item is { kind: 'existing'; img: ArtworkImage } => item.kind === 'existing')
      .map((item, i) => ({ ...item.img, displayOrder: i }));

    const newNewImages: ImageFile[] = reordered
      .filter((item): item is { kind: 'new'; img: ImageFile; newIndex: number } => item.kind === 'new')
      .map((item, i) => ({ ...item.img, position: i }));

    setEditForm(prev => prev ? { ...prev, existingImages: newExisting, newImages: newNewImages } : prev);
    setEditDragIndex(null);
    setEditDragOverIndex(null);
  }

  return (
    <form
      onSubmit={onSave}
      className="bg-black/2 border border-black/10 rounded-lg p-4 space-y-4 mt-1"
    >
      <p className="text-[10px] font-bold tracking-widest text-black/40 text-center uppercase">
        Edit Listing #{editForm.artworkId}
      </p>

      {/* ── Image management ── */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-center">Images</p>

        {pool.length === 0 ? (
          <p className="text-xs text-center text-black/30">No images — add at least one below.</p>
        ) : (
          <>
            <p className="text-xs text-center text-black/40">
              Drag to reorder · First is primary
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {pool.map((item, poolIndex) => {
                const isExisting = item.kind === 'existing';
                const src = isExisting ? item.img.imageURL : item.img.preview;
                const key = isExisting ? `existing-${item.img.id}` : `new-${item.img.preview}`;
                const isPrimary = poolIndex === 0;
                const isDragging = editDragIndex === poolIndex;
                const isTarget = editDragOverIndex === poolIndex && editDragIndex !== poolIndex;

                return (
                  <div
                    key={key}
                    draggable
                    onDragStart={() => setEditDragIndex(poolIndex)}
                    onDragEnter={() => setEditDragOverIndex(poolIndex)}
                    onDragEnd={handleEditDragEnd}
                    onDragOver={e => e.preventDefault()}
                    className="relative w-16 h-16 cursor-grab active:cursor-grabbing rounded overflow-hidden border-2 select-none transition-all duration-150"
                    style={{
                      borderColor: isTarget ? '#000' : isPrimary ? '#000' : isExisting ? '#d1d5db' : '#9ca3af',
                      borderStyle: isExisting ? 'solid' : 'dashed',
                      opacity: isDragging ? 0.35 : 1,
                      transform: isTarget ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    <img src={src} alt={`pool-${poolIndex}`} className="w-full h-full object-cover" />

                    {/* Position badge */}
                    <span className="absolute top-0 left-0 bg-black/60 text-white text-[8px] px-0.5 leading-4">
                      {poolIndex + 1}
                    </span>

                    {/* NEW badge for uploaded-but-not-saved images */}
                    {!isExisting && (
                      <span className="absolute bottom-0 left-0 bg-black/60 text-white text-[8px] px-0.5 leading-4">
                        NEW
                      </span>
                    )}

                    {/* Primary badge */}
                    {isPrimary && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[8px] text-center leading-4">
                        PRIMARY
                      </span>
                    )}

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => isExisting
                        ? onRemoveExistingImage(item.img.id)
                        : onRemoveNewImage(item.newIndex)
                      }
                      className="absolute top-0 right-0 bg-black/60 text-white text-[10px] w-4 h-4 flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <label className="flex flex-col items-center gap-1 cursor-pointer group">
          <span className="text-[10px] text-black/40 group-hover:text-black/60 transition-colors">
            + Add more images
          </span>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.tiff"
            onChange={onAddNewImages}
            onClick={e => { (e.target as HTMLInputElement).value = ''; }}
            className="hidden"
          />
        </label>
      </div>

      {/* ── Fields ── */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-center">Title</label>
        <input
          type="text"
          value={editForm.title}
          onChange={e => set('title', e.target.value)}
          className="block w-full border border-black/20 rounded px-3 py-1.5 text-xs text-center"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-center">Height (in)</label>
          <input
            type="text"
            value={editForm.heightInches}
            onChange={e => set('heightInches', e.target.value)}
            className="block w-full border border-black/20 rounded px-2 py-1.5 text-xs text-center"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-center">Width (in)</label>
          <input
            type="text"
            value={editForm.widthInches}
            onChange={e => set('widthInches', e.target.value)}
            className="block w-full border border-black/20 rounded px-2 py-1.5 text-xs text-center"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-center">Length (in)</label>
          <input
            type="text"
            value={editForm.lengthInches}
            onChange={e => set('lengthInches', e.target.value)}
            className="block w-full border border-black/20 rounded px-2 py-1.5 text-xs text-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-center">Price ($)</label>
          <input
            type="text"
            value={editForm.price}
            onChange={e => set('price', e.target.value)}
            onKeyDown={e => {
              const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
              if (allowed.includes(e.key)) return;
              if (!/[\d.]/.test(e.key)) { e.preventDefault(); return; }
              if (e.key === '.' && editForm.price.includes('.')) e.preventDefault();
            }}
            className="block w-full border border-black/20 rounded px-2 py-1.5 text-xs text-center"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-center">Year</label>
          <input
            type="text"
            value={editForm.yearCompleted}
            onChange={e => set('yearCompleted', e.target.value)}
            className="block w-full border border-black/20 rounded px-2 py-1.5 text-xs text-center"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-center">Weight</label>
          <input
            type="text"
            value={editForm.weight}
            onChange={e => set('weight', e.target.value)}
            className="block w-full border border-black/20 rounded px-2 py-1.5 text-xs text-center"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 items-end">
        <div className="flex flex-col items-center gap-1.5">
          <label className="text-xs font-semibold">For Sale?</label>
          <input
            type="checkbox"
            checked={editForm.forSale}
            onChange={e => set('forSale', e.target.checked)}
            className="w-4 h-4"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-center">Available Qty</label>
          <input
            type="number"
            value={editForm.availableQuantity}
            onChange={e => set('availableQuantity', e.target.value)}
            className="block w-full border border-black/20 rounded px-2 py-1.5 text-xs text-center"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isSavingEdit}
          className="button-spcl flex-1 text-xs py-2"
        >
          {isSavingEdit ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="button-spcl text-xs py-2 px-4 opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
