"""Operation scheduling interface contracts (showcase only)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class DispatchSnapshot:
    """Single-step dispatch state used by the scheduler contract.

    Attributes:
        load_elec_kw: Electrical load in kW.
        load_heat_kw: Thermal load in kW_th.
        pv_available_kw: Available PV generation in kW_elec.
        fuel_available_kg_s: Available fuel flow in kg/s.
    """

    load_elec_kw: float
    load_heat_kw: float
    pv_available_kw: float
    fuel_available_kg_s: float


def solve_day_ahead_dispatch(snapshots: List[DispatchSnapshot]) -> List[float]:
    """Return day-ahead dispatch decisions for each time step.

    Mathematical boundary:
        min J(x) subject to power balance, ramp constraints, and market limits.

    Args:
        snapshots: Ordered list of hourly boundary conditions.

    Returns:
        A list of normalized dispatch control signals in [0, 1].
    """
    raise NotImplementedError("Showcase repository: implementation is private.")

