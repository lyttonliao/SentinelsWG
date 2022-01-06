FROM python:3.9-alpine
LABEL maintainer="Lytton Liao - Sentinels"

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PATH="/scripts:/${PATH}"

RUN pip install --upgrade pip

COPY ./requirements.txt /requirements.txt
RUN apk add --update --no-cache postgresql-client jpeg-dev && \
    apk add --update --no-cache --virtual .tmp-build-deps \
        gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev && \
    pip install -r /requirements.txt && \
    apk del .tmp-build-deps

RUN mkdir /app
WORKDIR /app
COPY ./app /app
COPY ./scripts /scripts
RUN chmod +x /scripts/*

RUN mkdir -p /vol/web/media && \
    mkdir -p /vol/web/static && \
    adduser -D user && \
    chown -R user:user /vol/ && \
    chmod -R 755 /vol/web

USER user

VOLUME /vol/web

CMD ["entrypoint.sh"]