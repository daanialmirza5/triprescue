from app.engines.refund_engine import RefundEngine


def test_non_refundable_booking_yields_zero():
    engine = RefundEngine()
    result = engine.calculate_refund(
        cost=9200, refundable=False, refund_percentage=0.0, cancellation_deadline_hours=24, hours_before_start=48
    )
    assert result.refund_amount == 0.0


def test_example_from_spec_5000_at_80_percent_is_4000():
    engine = RefundEngine()
    result = engine.calculate_refund(
        cost=5000, refundable=True, refund_percentage=0.8, cancellation_deadline_hours=24, hours_before_start=48
    )
    assert result.refund_amount == 4000.0
    assert result.within_deadline is True


def test_late_cancellation_applies_half_rate():
    engine = RefundEngine()
    result = engine.calculate_refund(
        cost=5000, refundable=True, refund_percentage=0.8, cancellation_deadline_hours=24, hours_before_start=2
    )
    assert result.within_deadline is False
    assert result.refund_amount == 2000.0  # 5000 * 0.8 * 0.5


def test_zero_deadline_means_always_within_deadline():
    engine = RefundEngine()
    result = engine.calculate_refund(
        cost=1000, refundable=True, refund_percentage=1.0, cancellation_deadline_hours=0, hours_before_start=0
    )
    assert result.within_deadline is True
    assert result.refund_amount == 1000.0
