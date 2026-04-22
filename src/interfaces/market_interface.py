"""Market interface contracts (showcase only).

All formulas are documented for transparency. Implementations are intentionally
omitted in the public repository.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict


@dataclass(frozen=True)
class MarketInputs:
    """Container for market-side hourly inputs.

    Attributes:
        emission_actual_ton: Actual hourly CO2-equivalent emission in ton.
        emission_allowance_ton: Allocated free allowance in ton.
        carbon_price_cny_per_ton: Carbon market clearing price.
        electricity_price_cny_per_kwh: Spot electricity price.
    """

    emission_actual_ton: float
    emission_allowance_ton: float
    carbon_price_cny_per_ton: float
    electricity_price_cny_per_kwh: float


def calculate_carbon_cost(inputs: MarketInputs) -> float:
    """Calculate hourly carbon compliance cost.

    Physics/economics boundary:
        C_carbon = max(0, E_actual - E_allowance) * pi_carbon

    Args:
        inputs: Hourly market inputs.

    Returns:
        Hourly carbon cost in CNY.
    """
    raise NotImplementedError("Showcase repository: implementation is private.")


def calculate_market_cashflow(inputs: MarketInputs) -> Dict[str, float]:
    """Aggregate market cashflow items for one hour.

    This function is a high-level contract for:
    - electricity settlement
    - carbon settlement
    - certificate settlement

    Args:
        inputs: Hourly market inputs.

    Returns:
        A dictionary of settlement items in CNY.
    """
    raise NotImplementedError("Showcase repository: implementation is private.")

