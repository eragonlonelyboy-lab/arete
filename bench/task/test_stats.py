from stats import median, mean


def test_median_odd():
    assert median([3, 1, 2]) == 2


def test_median_single():
    assert median([5]) == 5


def test_mean():
    assert mean([1, 2, 3]) == 2.0


if __name__ == "__main__":
    test_median_odd()
    test_median_single()
    test_mean()
    print("all tests pass")
