function BookingForm({
  values,
  onChange,
  onSubmit,
  isSubmitting,
  selectedSeatIds,
  isSubmitDisabled,
  selectedWagonLabel,
}) {
  return (
    <form className="booking-form" onSubmit={onSubmit}>
      <div className="booking-form-header">
        <div className="booking-selection-summary">
          <span className="booking-chip">
            Вагон: {selectedWagonLabel || 'не обрано'}
          </span>
          <span className="booking-chip">
            Місця: {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : 'не обрано'}
          </span>
        </div>
      </div>

      <label className="booking-field">
        <span>Ім’я</span>
        <input
          name="name"
          type="text"
          required
          minLength="2"
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
          required
          pattern="^\+?[0-9\s\-()]{10,20}$"
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
          required
          value={values.email}
          onChange={onChange}
          placeholder="example@email.com"
        />
      </label>

      <button
        className="train-action"
        type="submit"
        disabled={isSubmitting || isSubmitDisabled}
      >
        {isSubmitting ? 'Зберігаємо...' : 'Забронювати квитки'}
      </button>
    </form>
  )
}

export default BookingForm
