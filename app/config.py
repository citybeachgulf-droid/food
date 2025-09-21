from typing import Optional


DEFAULT_DB_URL: str = "sqlite:////workspace/app.db"
DEFAULT_GROUP_SIZE: int = 4

# Randomness factor added to weighting (0.0 disables randomness)
DEFAULT_RANDOMNESS: float = 0.15

# If True, prefer candidates with more shared interests
DEFAULT_WEIGHTING_ENABLED: bool = True

# If set, seed shuffling for reproducibility per session
DEFAULT_RANDOM_SEED: Optional[int] = None
