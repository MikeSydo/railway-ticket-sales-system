function BookingForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  selectedSeatIds,
}) {
  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <div className="booking-form-header">
        <h3>Дані пасажира</h3>
        <p>Обрані місця: {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : 'не обрано'}</p>
      </div>

      <label className="booking-field">
        <span>Ім’я</span>
        <input
          name="name"
          type="text"
          value={values.name}
          onChange={onChange}
          placeholder="Введіть ім’я пасажира"
        />
      </label>

      <label className="booking-field">
        <span>Телефон</span>
        <input
          name="phone"
          type="tel"
          value={values.phone}
          onChange={onChange}
          placeholder="+380..."
        />
      </label>

      <label className="booking-field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          placeholder="example@email.com"
        />
      </label>

      <button className="train-action" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Зберігаємо...' : 'Забронювати квитки'}
      </button>
    </form>
  )
}

export default BookingForm
