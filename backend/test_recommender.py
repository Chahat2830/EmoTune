from services.recommender import get_recommendations


def main():
    moods = [
        "happy",
        "sad",
        "angry",
        "fear",
        "surprise",
    ]

    for mood in moods:
        print("\n" + "=" * 60)
        print(f"MOOD: {mood.upper()}")
        print("=" * 60)

        try:
            songs = get_recommendations(
                mood,
                limit=5,
            )

            if not songs:
                print("No recommendations found.")
                continue

            for index, song in enumerate(
                songs,
                start=1,
            ):
                print(
                    f"{index}. "
                    f"{song['song_name']} "
                    f"- {song['singer']}"
                )

                print(
                    f"   Mood: {song['mood']} | "
                    f"Recommendation: "
                    f"{song['recommendation_score']}"
                )

                print(
                    f"   Mood Score: "
                    f"{song['mood_score']} | "
                    f"Audio Similarity: "
                    f"{song['audio_similarity']}"
                )

        except Exception as error:
            print(
                f"ERROR for {mood}: "
                f"{type(error).__name__}: {error}"
            )


if __name__ == "__main__":
    main()