FROM node

COPY ./main.js /main.js

CMD node main.js

EXPOSE 80