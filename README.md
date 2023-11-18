# Telegram Thanos

A helper tool for removing all members of a telegram group.

### Disclaimer

Credentials to be used must belong to the creator of the group, else, you'll get removed as well 😂, dfkm, it's a true Thanos!

### Prerequisites

1. Telegram Bot token
2. Telegram API ID
3. Telegram API Hash

### Installation

1. Use the already built docker image (Recommended)

```sh
$ docker run \
   -it --name tg-thanos \
   -e BOT_TOKEN="<BOT_TOKEN>" \
   -e API_ID=<APP_ID> \
   -e API_HASH=<API_HASH> \
   emmanuerl/tg-thanos
```

2. Clone the repo, Build the image yourself and run it (I won't be there)
