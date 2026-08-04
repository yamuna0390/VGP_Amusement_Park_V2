/**
 * Allocates the next booking sequence for a visit date.
 * This method MUST be executed inside an existing transaction.
 *
 * @param {PoolConnection} connection
 * @param {string} visitDate (YYYY-MM-DD)
 * @returns {Promise<number>}
 */
async function allocateSequence(connection, visitDate) {

    // Lock the row for this visit date
    const [rows] = await connection.execute(
        `
        SELECT last_sequence
        FROM booking_sequences
        WHERE visit_date = ?
        FOR UPDATE
        `,
        [visitDate]
    );

    // First booking for this visit date
    if (rows.length === 0) {

        await connection.execute(
            `
            INSERT INTO booking_sequences
                (visit_date, last_sequence)
            VALUES
                (?, 1)
            `,
            [visitDate]
        );

        return 1;
    }

    // Increment sequence
    const nextSequence = rows[0].last_sequence + 1;

    await connection.execute(
        `
        UPDATE booking_sequences
        SET last_sequence = ?
        WHERE visit_date = ?
        `,
        [nextSequence, visitDate]
    );

    return nextSequence;
}

module.exports = {
    allocateSequence
};