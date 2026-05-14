import type { AlbumRepository } from '@domain/repositories/AlbumRepository'
import type { Album } from '@domain/entities/Album'
import { supabase } from '../remote/supabaseClient'

export class SupabaseAlbumRepository implements AlbumRepository {
  async getAll(): Promise<Album[]> {
    if (!supabase) throw new Error("Supabase client is not initialized.");
    
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(this.mapToEntity);
  }

  async getById(id: string): Promise<Album | null> {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // PostgREST code for zero rows
      throw new Error(error.message);
    }

    return this.mapToEntity(data);
  }

  async create(title: string, description: string): Promise<Album> {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    const { data, error } = await supabase
      .from('albums')
      .insert([
        { title, description }
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error("Supabase client is not initialized.");

    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  private mapToEntity(record: any): Album {
    return {
      id: record.id,
      title: record.title,
      description: record.description,
      coverImageUrl: record.cover_image_url,
      createdAt: new Date(record.created_at),
    };
  }
}
