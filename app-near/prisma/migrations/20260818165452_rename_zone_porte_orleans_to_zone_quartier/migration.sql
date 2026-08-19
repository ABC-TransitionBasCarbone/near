-- Rename enum value, existing rows keep pointing at the same label since
-- Postgres enum values are stored by OID, not by the label string.
ALTER TYPE "ZoneSelection" RENAME VALUE 'ZONE_PORTE_ORLEANS' TO 'ZONE_QUARTIER';
