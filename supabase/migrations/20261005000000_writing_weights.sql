create or replace function public.provisional_writing_score(tasks jsonb, writing jsonb)
returns integer
language sql
immutable
as $$
  with coverage as (
    select
      coalesce((task ->> 'weight')::numeric, 1) as weight,
      least(
        1.0,
        coalesce(array_length(regexp_split_to_array(nullif(btrim(writing ->> (task ->> 'id')), ''), '\s+'), 1), 0)
          / greatest((task ->> 'targetWords')::numeric, 1)
      ) as ratio
    from jsonb_array_elements(tasks) as task
  )
  select coalesce(round(60 * sum(ratio * weight) / nullif(sum(weight), 0))::integer, 0) from coverage;
$$;
