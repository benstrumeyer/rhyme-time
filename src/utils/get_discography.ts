import axios, { AxiosResponse } from "axios";
import { accessToken } from "../../keys";

interface Song {
  name: string;
}

interface Album {
  name: string;
  release_date: string;
  images: any[];
  id: string;
}

interface ErrorResponse {
  [status: string]: string;
}

const matchSongs = async (id: string, token: string): Promise<string[] | ErrorResponse> => {
  try {
    const response: AxiosResponse = await axios({
      url: `https://api.spotify.com/v1/albums/${id}/tracks`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { items }: { items: Song[] } = response.data;
    const names: string[] = items.map((song: Song) => song.name);
    return names;
  } catch (e: any) {
    const { status, statusText }: AxiosResponse = e.response
      ? e.response
      : { status: "400", statusText: "Unknown error" };

    return { [status]: statusText } as ErrorResponse;
  }
};

const getDiscography = async (id: string, limit = 1000): Promise<any> => {
  try {
    const response: AxiosResponse = await axios({
      url: `https://api.spotify.com/v1/artists/${id}/albums?limit=${limit}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { items }: { items: Album[] } = response.data;
    const radioheadAlbums = await Promise.all(
      items.map(async ({ name, release_date, images, id }, i) => ({
        [name]: {
          id: `${i}`,
          release_date,
          images,
          spotifyId: id,
          songs: await matchSongs(id, accessToken),
        },
      }))
    );

    return radioheadAlbums;
  } catch (e: any) {
    const { status, statusText }: AxiosResponse = e.response
      ? e.response
      : { status: "400", statusText: "Unknown error" };

    return { [status]: statusText } as ErrorResponse;
  }
};

export default getDiscography;
