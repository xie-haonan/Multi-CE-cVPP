"""SELCA interface contracts (showcase only)."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class SelcaInputs:
    """Inputs for lifecycle-equivalent emission estimation.

    Attributes:
        equipment_capacity_kw: Installed capacity in kW.
        annual_energy_output_kwh: Annual energy output in kWh.
        grid_emission_factor_kg_per_kwh: Grid emission factor.
    """

    equipment_capacity_kw: float
    annual_energy_output_kwh: float
    grid_emission_factor_kg_per_kwh: float


def calculate_lifecycle_emission(inputs: SelcaInputs) -> float:
    """Estimate lifecycle equivalent emissions.

    Boundary equation (illustrative):
        E_lca = E_construction + E_operation - E_substitution

    Args:
        inputs: Parameter set for lifecycle boundary accounting.

    Returns:
        Lifecycle equivalent emission in kgCO2e.
    """
    raise NotImplementedError("Showcase repository: implementation is private.")

