import pickle

PATH = "data/recommender.pkl"

with open(PATH, "rb") as file:
    obj = pickle.load(file)

print("\nTYPE:")
print(type(obj))

print("\nOBJECT:")
print(obj)

if isinstance(obj, dict):
    print("\nDICTIONARY KEYS:")
    print(obj.keys())

    for key, value in obj.items():
        print(
            f"\n{key}:"
            f"\n  type = {type(value)}"
        )

        if hasattr(value, "shape"):
            print(
                f"  shape = {value.shape}"
            )

        if hasattr(value, "mean_"):
            print(
                f"  mean shape = "
                f"{value.mean_.shape}"
            )

        if hasattr(value, "scale_"):
            print(
                f"  scale shape = "
                f"{value.scale_.shape}"
            )