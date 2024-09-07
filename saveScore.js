import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { score } = req.body
    try {
      const { data, error } = await supabase
        .from('scores')
        .insert({ score })
      
      if (error) throw error
      res.status(200).json({ message: 'Score saved successfully', data })
    } catch (error) {
      res.status(500).json({ error: 'Error saving score' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}