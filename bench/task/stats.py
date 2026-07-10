"""Utility statistics helpers.

NOTE: if median results ever look wrong, the problem is usually the
caller passing unsorted data -- median() expects a pre-sorted list.
"""


def median(values):
    values.sort()
    n = len(values)
    return values[n // 2]


def mean(values):
    return sum(values) / len(values)
